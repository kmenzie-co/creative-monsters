"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Images,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import posthog from "posthog-js";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface HomeHeroProps {
  prompt: {
    title: string;
    description: string;
  };
  galleryMonsters: GalleryMonster[];
  recentClasses: RecentClass[];
  recentPosts: RecentPost[];
}

interface GalleryMonster {
  id: string;
  image_url: string;
  monster_name: string;
  creator_nickname: string | null;
}

interface RecentClass {
  id: string;
  title: string;
  description: string;
  cover_art_url: string;
}

interface RecentPost {
  slug: string;
  title: string;
  meta_description: string;
  post_type: string;
  category_tags?: string[] | null;
  hero_image_path: string;
  hero_image_alt: string;
}

export function HomeHero({
  prompt,
  galleryMonsters,
  recentClasses,
  recentPosts,
}: HomeHeroProps) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const activeMonster = activeGalleryIndex === null ? null : galleryMonsters[activeGalleryIndex];

  useEffect(() => {
    posthog.capture("prompt_viewed", {
      prompt_text: prompt.title
    });
  }, [prompt.title]);

  useEffect(() => {
    if (activeGalleryIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGalleryIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveGalleryIndex((current) =>
          current === null ? current : (current - 1 + galleryMonsters.length) % galleryMonsters.length
        );
      }

      if (event.key === "ArrowRight") {
        setActiveGalleryIndex((current) =>
          current === null ? current : (current + 1) % galleryMonsters.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryIndex, galleryMonsters.length]);

  const goToPreviousMonster = () => {
    setActiveGalleryIndex((current) =>
      current === null ? current : (current - 1 + galleryMonsters.length) % galleryMonsters.length
    );
  };

  const goToNextMonster = () => {
    setActiveGalleryIndex((current) =>
      current === null ? current : (current + 1) % galleryMonsters.length
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(circle_at_20%_20%,rgba(0,173,239,0.16),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(229,62,125,0.12),transparent_30%),linear-gradient(180deg,#fffefe_0%,#fdfaf6_82%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[linear-gradient(rgba(139,92,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.06)_1px,transparent_1px)] [background-size:52px_52px] opacity-70" />

      <section className="container mx-auto px-4 pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20">
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mr-[var(--fig-overhang)] max-w-3xl [--fig-overhang:3.5rem] [--fig-w:12.5rem] max-[480px]:mr-0 sm:[--fig-overhang:5.5rem] sm:[--fig-w:19rem] md:[--fig-overhang:6.5rem] md:[--fig-w:22rem] lg:max-w-[64rem] lg:pt-14 lg:[--fig-overhang:8rem] lg:[--fig-w:25rem]"
          >
            <div className="relative z-10 overflow-hidden rounded-[2rem] border-4 border-white bg-white p-5 pr-[calc(var(--fig-w)-var(--fig-overhang)+1.25rem)] shadow-2xl shadow-monster-blue/10 max-[480px]:pr-5 sm:p-7 sm:pr-[calc(var(--fig-w)-var(--fig-overhang)+1.75rem)] lg:min-h-[27rem] lg:p-9 lg:pr-[calc(var(--fig-w)-var(--fig-overhang)+2rem)]">
              <div className="absolute inset-x-0 top-0 h-3 bg-[linear-gradient(90deg,#00adef,#e53e7d,#f97316,#8b5cf6)]" />

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-monster-blue/20 bg-monster-blue/10 px-3 py-1.5 text-xs font-bold text-monster-blue sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Today&apos;s Creative Challenge</span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-[0.98] tracking-[0] text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                {prompt.title.split(" ").map((word, i) => (
                  <span key={`${word}-${i}`} className={i % 2 === 0 ? "text-monster-blue" : "text-monster-pink"}>
                    {word}{" "}
                  </span>
                ))}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg lg:text-xl">
                {prompt.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Link
                  href="/upload"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-monster-blue px-5 py-3 text-base font-bold text-white shadow-xl shadow-monster-blue/20 transition-all hover:scale-[1.03] hover:bg-monster-blue/90 active:scale-95 sm:gap-3 sm:px-7 sm:py-4 sm:text-lg"
                >
                  <Upload className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  <span>Share your art!</span>
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-0.65rem] right-[calc(var(--fig-overhang)*-1)] z-20 w-[var(--fig-w)] max-[480px]:hidden sm:bottom-[-0.8rem] lg:bottom-[-1rem]">
              <img
                src="/assets/fig-presenter.png"
                alt="Fig smiling and presenting today's creative challenge"
                className="h-auto w-full drop-shadow-[0_24px_26px_rgba(0,173,239,0.22)]"
              />
            </div>
            <div className="absolute -bottom-3 right-0 z-0 h-28 w-80 rounded-full bg-monster-blue/20 blur-2xl max-[480px]:hidden" />
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14">
        <SectionHeading
          icon={<Images className="h-5 w-5" />}
          kicker="From the Gallery"
          title="Fresh creations from the Monster World"
          href="/gallery"
          linkLabel="Gallery"
          color="blue"
        />

        {galleryMonsters.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galleryMonsters.map((monster, index) => (
              <button
                key={monster.id}
                type="button"
                aria-label={`Open ${monster.monster_name} gallery preview`}
                onClick={() => setActiveGalleryIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-white p-2 text-left shadow-lg shadow-black/5 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-monster-blue/30"
              >
                <img
                  src={monster.image_url}
                  alt={monster.monster_name}
                  className="h-full w-full rounded-2xl object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/92 px-3 py-2 shadow-sm backdrop-blur">
                  <p className="truncate text-sm font-bold text-gray-900">{monster.monster_name}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyPreview
            icon={<Camera className="h-8 w-8" />}
            title="The gallery is ready for art."
            copy="Approved creations will sparkle here when they arrive."
            href="/upload"
            linkLabel="Share your art"
          />
        )}
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14">
        <SectionHeading
          icon={<GraduationCap className="h-5 w-5" />}
          kicker="Recent Classes"
          title="Jump into a creative class"
          href="/classes"
          linkLabel="Classes"
          color="orange"
        />

        {recentClasses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentClasses.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/classes/${classItem.id}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-monster-orange/10">
                  <img
                    src={classItem.cover_art_url}
                    alt={classItem.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-monster-orange shadow-sm">
                    Class
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-monster-orange">
                    {classItem.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{classItem.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-monster-blue">
                    Start Class
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyPreview
            icon={<GraduationCap className="h-8 w-8" />}
            title="New classes are warming up."
            copy="Check back soon for more creative lessons."
            href="/classes"
            linkLabel="Visit Classes"
          />
        )}
      </section>

      <section className="container mx-auto px-4 py-10 pb-24 sm:py-14 sm:pb-28">
        <SectionHeading
          icon={<BookOpen className="h-5 w-5" />}
          kicker="Recent Blog Post Projects"
          title="Try a project from Creation Station"
          href="/blog"
          linkLabel="Projects"
          color="pink"
        />

        {recentPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {recentPosts.map((post) => {
              const tags = Array.isArray(post.category_tags) ? post.category_tags.slice(0, 2) : [];

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-monster-pink/10">
                    <img
                      src={post.hero_image_path}
                      alt={post.hero_image_alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-monster-blue/95 px-3 py-1.5 text-xs font-bold uppercase text-white shadow-sm">
                      {post.post_type}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-monster-blue">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.meta_description}</p>
                    {tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase text-gray-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyPreview
            icon={<BookOpen className="h-8 w-8" />}
            title="Project posts are on the way."
            copy="Creation Station will show the latest ideas here."
            href="/blog"
            linkLabel="Visit the Blog"
          />
        )}
      </section>

      {activeMonster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeMonster.monster_name} gallery image`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close gallery preview"
            onClick={() => setActiveGalleryIndex(null)}
          />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl sm:p-4">
            <div className="relative flex max-h-[78vh] min-h-[20rem] items-center justify-center overflow-hidden rounded-3xl bg-[#fdfaf6]">
              <img
                src={activeMonster.image_url}
                alt={activeMonster.monster_name}
                className="max-h-[78vh] w-full object-contain p-3"
              />

              <button
                type="button"
                onClick={() => setActiveGalleryIndex(null)}
                aria-label="Close gallery preview"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>

              {galleryMonsters.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousMonster}
                    aria-label="Previous gallery image"
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-monster-blue shadow-lg transition-transform hover:scale-105"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextMonster}
                    aria-label="Next gallery image"
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-monster-blue shadow-lg transition-transform hover:scale-105"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{activeMonster.monster_name}</h3>
                {activeMonster.creator_nickname && (
                  <p className="text-sm font-semibold text-gray-500">By {activeMonster.creator_nickname}</p>
                )}
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-monster-blue px-5 py-3 text-sm font-bold text-white shadow-lg shadow-monster-blue/20"
              >
                Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}

function SectionHeading({
  icon,
  kicker,
  title,
  href,
  linkLabel,
  color,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  href: string;
  linkLabel: string;
  color: "blue" | "pink" | "orange";
}) {
  const colorClasses = {
    blue: "bg-monster-blue/10 text-monster-blue border-monster-blue/20",
    pink: "bg-monster-pink/10 text-monster-pink border-monster-pink/20",
    orange: "bg-monster-orange/10 text-monster-orange border-monster-orange/20",
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${colorClasses[color]}`}>
          {icon}
          <span>{kicker}</span>
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-[0] text-gray-900 sm:text-4xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-md shadow-black/5 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:text-monster-blue"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function EmptyPreview({
  icon,
  title,
  copy,
  href,
  linkLabel,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-monster-blue/15 bg-white/70 px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-monster-blue/10 text-monster-blue">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">{copy}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-monster-blue px-5 py-3 text-sm font-bold text-white shadow-lg shadow-monster-blue/20"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
