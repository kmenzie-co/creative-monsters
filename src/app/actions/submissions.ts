"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function saveSubmission(imageUrl: string, monsterName: string, creatorNickname: string) {
  try {
    if (!imageUrl || !monsterName) {
      return { error: "Missing required fields!" };
    }

    const { error } = await supabaseAdmin
      .from("submissions")
      .insert([
        {
          image_url: imageUrl,
          monster_name: monsterName,
          creator_nickname: creatorNickname || null,
          status: "pending",
        },
      ]);

    if (error) {
      console.error("Supabase DB Error:", error);
      return { error: `Failed to save creation: ${error.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/gallery");
    return { success: true };
  } catch (err) {
    console.error("Save submission error:", err);
    return { error: "Something went wrong on the server" };
  }
}


export async function submitMonster(formData: FormData) {
  // Deprecated: use client-side upload + saveSubmission for better performance on Vercel
  return { error: "Please use the updated client-side upload method." };
}

export async function getPendingSubmissions() {
  const { data, error } = await supabaseAdmin
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
  const { error } = await supabaseAdmin
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
  const { error } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
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
    
    const { data: prompt, error } = await supabaseAdmin
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
