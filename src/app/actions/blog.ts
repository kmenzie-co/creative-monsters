"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getPublishedPosts() {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .lte("publish_date", now)
    .eq("status", "scheduled") // or "published" if we used that, but instructions say scheduled
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data;
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }
  return data;
}

export async function createBatchPosts(posts: any[]) {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert(posts);

  if (error) {
    console.error("Error creating posts:", error);
    throw error;
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return data;
}
