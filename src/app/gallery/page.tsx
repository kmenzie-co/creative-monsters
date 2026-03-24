import { getApprovedSubmissions } from "@/app/actions/submissions";
import { Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import { MonsterGrid } from "@/components/MonsterGrid";

export default async function GalleryPage() {
  const monsters = await getApprovedSubmissions();

  return (
    <div className="relative isolate min-h-screen bg-background pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <header className="mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-monster-teal/10 px-4 py-1.5 text-sm font-semibold text-monster-teal border border-monster-teal/20 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>The Portal is Open!</span>
          </div>
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-6xl font-display font-bold text-gray-900 mb-4 px-4 leading-tight">
              Creative <span className="text-monster-blue">Gallery</span> ✨
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              See all the amazing art and creations shared by your fellow Creative Monsters!
            </p>
          </div>
        </header>

        {monsters.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-monster-blue/10 text-monster-blue">
              <Camera className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2 px-4">The Gallery is Empty!</h2>
            <p className="text-gray-500 mb-8 px-4">Be the first to share your art with the world.</p>
            <Link
              href="/upload"
              className="rounded-full bg-monster-blue px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Share your art!
            </Link>
          </div>
        ) : (
          <MonsterGrid monsters={monsters} />
        )}
      </div>
    </div>
  );
}
