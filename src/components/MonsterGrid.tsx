"use client";

import { motion } from "framer-motion";
import { MonsterCard } from "./MonsterCard";

interface MonsterGridProps {
  monsters: any[];
}

export function MonsterGrid({ monsters }: MonsterGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {monsters.map((monster) => (
        <MonsterCard key={monster.id} monster={monster} />
      ))}
    </motion.div>
  );
}
