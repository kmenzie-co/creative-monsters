"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Tag, ChevronRight } from "lucide-react";

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
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-monster-blue/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm uppercase tracking-wider">
            {post.post_type}
          </span>
        </div>
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
          <div className="flex gap-2">
            {post.category_tags.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500 uppercase">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-monster-blue hover:gap-2 transition-all"
          >
            Read More
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
