"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function ParallaxFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll on the whole page
  const { scrollY } = useScroll();

  // Background layer: Moves very slowly (e.g., shifts 50px upwards as user scrolls)
  const bgY = useTransform(scrollY, [0, 1000], [0, -50]);
  
  // Middle layer: Moves faster (e.g., shifts 150px upwards as user scrolls)
  const middleY = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div ref={containerRef} className="fixed bottom-0 left-0 right-0 z-10 w-full pointer-events-none overflow-hidden h-[800px]">
      {/* Background Layer: Slower */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-full"
      >
        <Image 
          src="/bg.png" 
          alt="Background Mountain Plane" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* Middle Ground Layer: Faster */}
      <motion.div 
        style={{ y: middleY }}
        className="absolute inset-x-0 bottom-0 w-full h-full translate-y-20" // Slight initial offset to separate them
      >
        <Image 
          src="/tree-middleground.png" 
          alt="Middle Ground Trees" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* Foreground Layer (Placeholder or coming soon) */}
      <div className="absolute inset-x-0 bottom-0 w-full h-[200px] pointer-events-none" />
    </div>
  );
}
