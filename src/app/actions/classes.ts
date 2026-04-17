'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function createClass(data: {
  title: string;
  description: string;
  cover_art_url: string;
  intro_text: string;
  outro_text: string;
  core_video_url: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from('classes')
      .insert([data]);

    if (error) {
      console.error('Supabase DB Error building Class:', error);
      return { error: `Failed to create class: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/classes');
    return { success: true };
  } catch (err: any) {
    return { error: 'Unknown server error occurred' };
  }
}

export async function deleteClass(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: `Failed to delete class: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/classes');
    return { success: true };
  } catch (err: any) {
    return { error: 'Unknown server error occurred' };
  }
}

export async function getClasses() {
  const { data, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Class fetch error:', error);
    return [];
  }
  return data;
}

export async function getClassById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Class fetch by ID error:', error);
    return null;
  }
  return data;
}
