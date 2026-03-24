"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitMonster(formData: FormData) {
  try {
    const image = formData.get("image") as File;
    const monsterName = formData.get("monsterName") as string;
    const creatorNickname = formData.get("creatorNickname") as string;

    if (!image || !monsterName) {
      return { error: "Missing required fields (image and monster name are required!)" };
    }

    // Check file size (Vercel has a 4.5MB limit for server actions, but we boosted Next.js to 10MB)
    // Note: Vercel's platform-level limit is 4.5MB, so this may still fail.
    if (image.size > 9 * 1024 * 1024) {
      return { error: "Image is too large! Please pick a photo smaller than 10MB." };
    }

    // 1. Upload image to Supabase Storage
    const fileExt = image.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Uploaded Art")
      .upload(filePath, image);

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      if (uploadError.message.toLowerCase().includes("bucket not found")) {
        return { error: "The 'Uploaded Art' bucket is missing! Please create it in your Supabase dashboard." };
      }
      return { error: `Upload failed: ${uploadError.message}` };
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("Uploaded Art")
      .getPublicUrl(filePath);

    // 3. Create submission record in DB
    const { error: dbError } = await supabase
      .from("submissions")
      .insert([
        {
          image_url: publicUrl,
          monster_name: monsterName,
          creator_nickname: creatorNickname || null,
          status: "pending",
        },
      ]);

    if (dbError) {
      console.error("Supabase DB Error:", dbError);
      if (dbError.code === 'PGRST205') {
        return { error: "The 'submissions' table is missing! Please run the SQL schema in your Supabase dashboard." };
      }
      return { error: `Failed to save monster: ${dbError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/gallery");
    return { success: true };
  } catch (err) {
    console.error("Unhappy monster error:", err);
    return { error: err instanceof Error ? err.message : "Something went wrong on the server" };
  }
}

export async function getPendingSubmissions() {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn("Table 'submissions' not found. Please run the SQL schema in your Supabase dashboard.");
      return [];
    }
    console.error("Fetch pending error:", error);
    return [];
  }

  return data;
}

export async function approveMonster(id: string) {
  const { error } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error("Approve error:", error);
    throw new Error("Failed to approve monster");
  }

  revalidatePath("/admin");
  revalidatePath("/gallery");
  return { success: true };
}

export async function rejectMonster(id: string) {
  const { error } = await supabase
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error("Reject error:", error);
    throw new Error("Failed to reject monster");
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function getApprovedSubmissions() {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn("Table 'submissions' not found. Please run the SQL schema in your Supabase dashboard.");
      return [];
    }
    console.error("Fetch approved error:", error);
    return [];
  }

  return data;
}

export async function getTodayPrompt() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: prompt, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("date", today)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Fetch prompt error:", error);
      }
      return null;
    }

    return prompt;
  } catch (err) {
    console.error("Failed to fetch today's prompt:", err);
    return null;
  }
}
