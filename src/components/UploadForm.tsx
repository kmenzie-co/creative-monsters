"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, Loader2, X, Sparkles } from "lucide-react";
import { saveSubmission } from "@/app/actions/submissions";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface UploadFormProps {
  prompt: {
    title: string;
    description: string;
  };
}

export function UploadForm({ prompt }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [monsterName, setMonsterName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !monsterName) return;

    // Check file size (Vercel has a 4.5MB limit, but Supabase allows much more)
    if (file.size > 9 * 1024 * 1024) {
      setError("Image is too large! Please pick a photo smaller than 10MB.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage (on the client!)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Uploaded Art")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Client Upload Error:", uploadError);
        setError(`Upload failed: ${uploadError.message}. Check your Supabase Storage permissions!`);
        setIsSubmitting(false);
        return;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("Uploaded Art")
        .getPublicUrl(filePath);

      // 3. Save submission record in DB (Server Action)
      const result = await saveSubmission(publicUrl, monsterName, nickname);
      
      if (result?.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-md"
        >
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-monster-blue/20 text-monster-blue mx-auto">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Art Received! 👾
          </h1>
          <div className="space-y-4 text-lg text-gray-600 mb-12">
            <p>“Your creation is stretching its legs…”</p>
            <p>“The Gallery Welcome Committee is taking a look!”</p>
            <p>“Check back soon to see if your work joins the world.”</p>
          </div>
          <Link
            href="/"
            className="inline-block rounded-xl bg-monster-blue px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Go back home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Prompt Reminder Card */}
      <div className="rounded-3xl bg-monster-blue/5 border-2 border-monster-blue/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-monster-blue/5 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-monster-blue text-white shadow-lg shadow-monster-blue/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-monster-blue/60 mb-1">Today&apos;s Challenge</h3>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">{prompt.title}</h2>
            <p className="text-gray-600 leading-relaxed">{prompt.description}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Picker */}
        <div className="group relative">
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative aspect-square w-full overflow-hidden rounded-3xl border-4 border-dashed border-monster-blue/30 bg-gray-50 flex items-center justify-center p-2"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-2xl shadow-lg"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-gray-500 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="empty"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex aspect-square w-full flex-col items-center justify-center rounded-3xl border-4 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-monster-blue/30 group-hover:bg-white"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-monster-blue/10 text-monster-blue group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-10 w-10" />
                </div>
                <p className="text-xl font-bold text-gray-900">Take a photo of your art</p>
                <p className="mt-2 text-gray-500">Or tap to pick a file</p>
              </motion.button>
            )}
          </AnimatePresence>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            required
          />
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="monsterName" className="block text-sm font-semibold text-gray-700 mb-2">
              What is it called? *
            </label>
            <input
              type="text"
              id="monsterName"
              value={monsterName}
              onChange={(e) => setMonsterName(e.target.value)}
              placeholder="e.g. The Super Speedy Spaceship"
              required
              className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 focus:border-monster-blue focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 mb-2">
              What is your Monster Nickname?
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Captain Creative"
              className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 focus:border-monster-blue focus:outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-monster-blue py-4 text-lg font-bold text-white shadow-xl shadow-monster-blue/20 transition-all hover:scale-[1.02] hover:bg-monster-blue/90 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending to the gallery...</span>
            </>
          ) : (
            <span>Share your art!</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
