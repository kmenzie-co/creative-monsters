'use server';

import { startAvatarVideo, checkAvatarVideoTask } from '@/lib/runway';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { concatenateClassVideo } from '@/lib/videoBuilder';

export type AvatarVideoStatus = 'pending' | 'succeeded' | 'failed';

export interface AvatarVideoResult {
  status: AvatarVideoStatus;
  taskId?: string;
  videoUrl?: string;
  error?: string;
}

/**
 * Initiates the generation of an avatar video for a given name and type.
 * Uses a compound key child_name-class_id-type.
 */
export async function generateAvatarVideo(childName: string, classId: string, type: 'intro' | 'outro', scriptTemplate: string): Promise<AvatarVideoResult> {
  const nameKey = `${childName.trim().toLowerCase()}-${classId}-${type}`;

  try {
    const { data: existingRecords, error: fetchError } = await supabaseAdmin
      .from('avatar_videos')
      .select('*')
      .eq('child_name', nameKey)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) throw new Error('Database error');

    const record = existingRecords?.[0];

    if (record) {
      if (record.status === 'succeeded' && record.video_url) {
        return { status: 'succeeded', videoUrl: record.video_url };
      }
      if (record.status === 'pending' && record.runway_task_id) {
        return { status: 'pending', taskId: record.runway_task_id };
      }
    }

    // Replace script variables, assuming [name] or similar is in the scriptTemplate
    const finalScript = scriptTemplate.replace(/\[name\]/g, childName.trim());
    const taskId = await startAvatarVideo(finalScript);

    const { error: insertError } = await supabaseAdmin
      .from('avatar_videos')
      .insert({
        child_name: nameKey,
        runway_task_id: taskId,
        status: 'pending',
      });

    if (insertError) throw new Error('Failed to save to database');

    return { status: 'pending', taskId };
  } catch (err: any) {
    return { status: 'failed', error: err.message };
  }
}

export async function pollAvatarVideoStatus(taskId: string): Promise<AvatarVideoResult> {
  try {
    const taskData = await checkAvatarVideoTask(taskId);

    if (taskData.status === 'SUCCEEDED') {
      const videoUrl = taskData.output?.[0];
      if (!videoUrl) throw new Error('Task succeeded but no video URL found');

      await supabaseAdmin
        .from('avatar_videos')
        .update({ status: 'succeeded', video_url: videoUrl })
        .eq('runway_task_id', taskId);

      return { status: 'succeeded', videoUrl };
    }

    if (taskData.status === 'FAILED' || taskData.status === 'CANCELLED') {
      await supabaseAdmin
        .from('avatar_videos')
        .update({ status: 'failed' })
        .eq('runway_task_id', taskId);

      return { status: 'failed', error: taskData.failure || 'RunwayML task failed' };
    }

    return { status: 'pending', taskId };
  } catch (err: any) {
    return { status: 'failed', error: err.message };
  }
}

/**
 * Commences the FFmpeg stitch process in the background. Tracks state in Supabase.
 */
export async function stitchClassVideo(
  childName: string,
  classId: string,
  introUrl: string,
  outroUrl: string,
  coreVideoUrl: string
): Promise<AvatarVideoResult> {
  const finalKey = `${childName.trim().toLowerCase()}-${classId}-final`;

  try {
    const { data: existingRecords } = await supabaseAdmin
      .from('avatar_videos')
      .select('*')
      .eq('child_name', finalKey)
      .order('created_at', { ascending: false })
      .limit(1);

    const record = existingRecords?.[0];

    // If it's already done
    if (record?.status === 'succeeded' && record.video_url) {
      return { status: 'succeeded', videoUrl: record.video_url };
    }

    // If it's currently processing (and less than 5 minutes old to prevent perpetual stuck states)
    if (record?.status === 'pending') {
      const age = Date.now() - new Date(record.created_at).getTime();
      if (age < 5 * 60 * 1000) {
        return { status: 'pending' };
      }
      console.warn(`[avatarVideos] Task ${finalKey} stuck on pending for over 5 mins. Force restarting.`);
    }

    // Create pending record precisely
    if (!record) {
      const { error: insErr } = await supabaseAdmin.from('avatar_videos').insert({
        child_name: finalKey,
        status: 'pending',
      });
      if (insErr) throw insErr;
    } else if (record.status === 'failed') {
      const { error: updErr } = await supabaseAdmin.from('avatar_videos').update({
        status: 'pending',
      }).eq('id', record.id);
      if (updErr) throw updErr;
    }

    // Kick off FFmpeg async without awaiting, so we return immediately
    // Next.js development server keeps process alive, but beware this architecture on Vercel Edge.
    concatenateClassVideo(childName, classId, introUrl, outroUrl, coreVideoUrl)
      .then(async (finalUrl) => {
        await supabaseAdmin
          .from('avatar_videos')
          .update({ status: 'succeeded', video_url: finalUrl })
          .eq('child_name', finalKey)
          .eq('status', 'pending');
      })
      .catch(async (err) => {
        console.error("FFmpeg background stitch error:", err);
        await supabaseAdmin
          .from('avatar_videos')
          .update({ status: 'failed' })
          .eq('child_name', finalKey)
          .eq('status', 'pending');
      });

    return { status: 'pending' };
  } catch (err: any) {
    return { status: 'failed', error: err.message };
  }
}

/**
 * Polls the Supabase database directly for the final video render status
 */
export async function pollStitchStatus(childName: string, classId: string): Promise<AvatarVideoResult> {
  const finalKey = `${childName.trim().toLowerCase()}-${classId}-final`;
  
  const { data } = await supabaseAdmin
    .from('avatar_videos')
    .select('*')
    .eq('child_name', finalKey)
    .single();

  // Return pending instead of failed if no data is found to avoid React UI race conditions on startup
  if (!data) return { status: 'pending' };
  
  return { 
    status: data.status as AvatarVideoStatus, 
    videoUrl: data.video_url || undefined 
  };
}
