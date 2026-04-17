import fs from 'fs';
import path from 'path';
import os from 'os';
import ffmpeg from 'fluent-ffmpeg';
import { supabaseAdmin } from './supabase-admin';

// Safely require the ffmpeg installer to bypass strict Next.js webpack parsing
const installerPath = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@ffmpeg-installer/ffmpeg').path;
  } catch (e) {
    console.error("Failed to load @ffmpeg-installer/ffmpeg local binary. Install it locally.");
    return 'ffmpeg'; // Default fallback back to global system ffmpeg
  }
})();

// Set ffmpeg path using the platform-specific binary
ffmpeg.setFfmpegPath(installerPath);

/**
 * Downloads a video from a URL and saves it to a temporary local path.
 */
async function downloadVideo(url: string, outputPath: string): Promise<void> {
  // Handle local public paths if needed (e.g. /videos/core.mp4)
  const finalUrl = url.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${url}`
    : url;

  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error(`Failed to download from ${finalUrl}`);
  
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
}

/**
 * Splices three videos together seamlessly using FFmpeg.
 * Intros and Outros come dynamically from Runway endpoints (HTTP URLs).
 * Core video can be a URL or a local path.
 * The production result is uploaded to Supabase Storage.
 */
export async function concatenateClassVideo(
  childName: string,
  classId: string,
  introUrl: string,
  outroUrl: string,
  coreVideoUrl: string
): Promise<string> {
  // Use /tmp for Vercel/Serverless environments
  const tempDir = path.join(os.tmpdir(), 'creative-monsters-videos');
  
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const safeName = childName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const timestamp = Date.now();
  const finalFilename = `${safeName}_${classId}_${timestamp}.mp4`;
  
  const tempIntroPath = path.join(tempDir, `intro_${finalFilename}`);
  const tempOutroPath = path.join(tempDir, `outro_${finalFilename}`);
  const tempCorePath = path.join(tempDir, `core_${classId}.mp4`);
  const localOutputPath = path.join(tempDir, finalFilename);

  // Download core video if not already cached in temp
  if (!fs.existsSync(tempCorePath)) {
    console.log(`[videoBuilder] Downloading/Caching core video for class ${classId}...`);
    await downloadVideo(coreVideoUrl, tempCorePath);
  }

  console.log(`[videoBuilder] Downloading intro for ${childName}...`);
  await downloadVideo(introUrl, tempIntroPath);
  
  console.log(`[videoBuilder] Downloading outro for ${childName}...`);
  await downloadVideo(outroUrl, tempOutroPath);

  console.log(`[videoBuilder] Launching FFmpeg combination for ${childName}...`);

  return new Promise((resolve, reject) => {
    const listFilePath = path.join(tempDir, `list_${finalFilename}.txt`);
    const fileListContent = `file '${tempIntroPath}'\nfile '${tempCorePath}'\nfile '${tempOutroPath}'`;
    fs.writeFileSync(listFilePath, fileListContent, 'utf-8');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-vsync 2',
        '-preset fast'
      ])
      .save(localOutputPath)
      .on('start', (cmd: string) => {
        console.log(`[videoBuilder] FFmpeg stated with command: ${cmd}`);
      })
      .on('end', async () => {
        console.log(`[videoBuilder] Local generation success: ${localOutputPath}`);
        
        try {
          // Upload to Supabase Storage
          console.log(`[videoBuilder] Uploading ${finalFilename} to Supabase...`);
          const fileBuffer = fs.readFileSync(localOutputPath);
          
          const { error: uploadError } = await supabaseAdmin
            .storage
            .from('Classes')
            .upload(`generated/${finalFilename}`, fileBuffer, {
              contentType: 'video/mp4',
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) throw uploadError;

          // Get Public URL
          const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('Classes')
            .getPublicUrl(`generated/${finalFilename}`);

          console.log(`[videoBuilder] Upload success: ${publicUrl}`);

          // Clean up temporary files safely
          fs.unlinkSync(tempIntroPath);
          fs.unlinkSync(tempOutroPath);
          fs.unlinkSync(listFilePath);
          fs.unlinkSync(localOutputPath);

          resolve(publicUrl);
        } catch (uploadErr: any) {
          console.error(`[videoBuilder] Upload/Cleanup error:`, uploadErr);
          reject(uploadErr);
        }
      })
      .on('error', (err: any) => {
        console.error(`[videoBuilder] FFmpeg rendering error:`, err);
        reject(err);
      });
  });
}
