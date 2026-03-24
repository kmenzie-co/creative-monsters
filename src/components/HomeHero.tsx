"use client";

import Link from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Camera, Palette, Construction } from "lucide-react";
import Link_Next from "next/link"; // Re-import with a different name to avoids conflict with Image
import posthog from "posthog-js";
import { useEffect } from "react";

interface HomeHeroProps {
  prompt: {
    title: string;
    description: string;
  };
  supportingCopy: string[];
}

export function HomeHero({ prompt, supportingCopy }: HomeHeroProps) {
  useEffect(() => {
    // Track prompt view
    posthog.capture("prompt_viewed", {
      prompt_text: prompt.title
    });
  }, [prompt.title]);

  return (
    <div className="relative">
      {/* Content */}

      <div className="container mx-auto px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-monster-blue/10 px-4 py-1.5 text-sm font-semibold text-monster-blue border border-monster-blue/20 mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Today&apos;s Creative Challenge</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8">
              {prompt.title.split(" ").map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-monster-blue" : "text-monster-pink"}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
              {prompt.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link_Next
                href="/upload"
                className="group relative flex items-center gap-3 rounded-full bg-monster-blue px-8 py-4 text-xl font-bold text-white shadow-xl shadow-monster-blue/20 transition-all hover:scale-105 hover:bg-monster-blue/90 active:scale-95"
              >
                <Camera className="h-6 w-6 transition-transform group-hover:rotate-12" />
                <span>Show your art!</span>
              </Link_Next>
              
              <Link_Next
                href="/gallery"
                className="flex items-center gap-2 px-8 py-4 text-lg font-medium text-monster-pink hover:text-monster-pink/80 transition-colors"
              >
                <span>Visit the Gallery</span>
                <span className="text-2xl">→</span>
              </Link_Next>
            </div>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-monster-blue/10 text-monster-blue">
                <Palette className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">Every Creative Monster has a big imagination.</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-monster-pink/10 text-monster-pink">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">{supportingCopy[1]}</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-monster-orange/10 text-monster-orange">
                <Construction className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">New creative challenges added every day!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
