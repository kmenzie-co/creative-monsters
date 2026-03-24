"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function ParallaxFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll only when this component is in / entering view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Mountain layer: Starts at -100px and moves slowly to its target as you scroll.
  // It effectively shifts less than 1:1 with the parent scroll.
  const mountainOffset = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  
  // Potential Foreground layer: Moves quickly (shifting faster than the parent scroll)
  const foregroundOffset = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="relative w-full h-[700px] overflow-hidden pointer-events-none">
      {/* 1. Background Mountain Layer: Slower movement relative to scroll */}
      <motion.div 
        style={{ y: mountainOffset, scale: 1.1 }}
        className="absolute inset-0 z-0 h-[120%] -bottom-10"
      >
        <Image 
          src="/bg.png" 
          alt="Background Mountain Plane" 
          fill 
          className="object-cover object-center"
          priority
        />
      </motion.div>

      {/* 2. Middle Ground Trees Layer: Static (1:1 with scroll) */}
      <div className="absolute inset-x-0 bottom-0 z-10 w-full h-full">
        <Image 
          src="/tree-middleground.png" 
          alt="Middle Ground Trees" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* 3. Foreground Layer (Placeholder): Faster movement relative to scroll */}
      <motion.div 
        style={{ y: foregroundOffset }}
        className="absolute bottom-0 left-0 right-0 z-20 h-[300px] pointer-events-none"
      >
        {/* You can add foreground grass/clouds here later */}
      </motion.div>
    </div>
  );
}
