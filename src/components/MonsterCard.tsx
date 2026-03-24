"use client";

import { motion } from "framer-motion";

interface MonsterCardProps {
  monster: {
    id: string;
    image_url: string;
    monster_name: string;
    creator_nickname: string | null;
  };
}

export function MonsterCard({ monster }: MonsterCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-black/5 ring-1 ring-black/5 transition-shadow hover:shadow-xl"
    >
      <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
        <img
          src={monster.image_url}
          alt={monster.monster_name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 p-2"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mt-4 px-2 pb-2 text-left">
        <h3 className="font-display text-xl font-bold text-gray-900 group-hover:text-monster-pink transition-colors">
          {monster.monster_name}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-500 italic">
          Built by {monster.creator_nickname || "a Mystery Maker"}
        </p>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-monster-pink/10 blur-xl group-hover:bg-monster-pink/20 transition-colors" />
    </motion.div>
  );
}
