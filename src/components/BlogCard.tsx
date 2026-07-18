"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    meta_description: string;
    post_type: string;
    category_tags: string[];
    hero_image_path: string;
    hero_image_alt: string;
    publish_date: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  const publishedDate = new Date(post.publish_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100 h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden relative">
        <img
          src={post.hero_image_path}
          alt={post.hero_image_alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {publishedDate}
          </div>
        </div>

        <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 group-hover:text-monster-blue transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mb-6 line-clamp-2 text-sm text-gray-600 flex-1">
          {post.meta_description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/blog/${post.slug}`}
            className="ml-auto flex items-center gap-1 text-sm font-bold text-monster-blue hover:gap-2 transition-all"
          >
            Read More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
