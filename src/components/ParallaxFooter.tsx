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

  // 1. Background (bg.png): Moves slower than the scroll by drifting DOWN
  // Starts extremely high (-400) to ensure the peaks are clear immediately
  const bgY = useTransform(scrollYProgress, [0, 1], [-400, 0]);
  
  // 3. Foreground (tree-foreground.png): Moves faster than the scroll by drifting UP
  // Starts 600px low for a very high-speed "emerging from the floor" feel
  const fgY = useTransform(scrollYProgress, [0, 1], [600, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[900px] pointer-events-none -mt-24">
      {/* LAYER 1: Background Mountains (Slower) */}
      <motion.div 
        style={{ y: bgY, scale: 1.1 }}
        className="absolute inset-x-0 bottom-0 z-0 h-full w-full"
      >
        <Image 
          src="/bg.png" 
          alt="Background Mountain Plane" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </motion.div>

      {/* LAYER 2: Middle Ground Trees (Anchor - Inline 1:1) */}
      <div className="absolute inset-x-0 -bottom-1 z-10 w-full h-[105%]">
        <Image 
          src="/tree-middleground.png" 
          alt="Middle Ground Trees" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* LAYER 3: Foreground Trees (Faster) */}
      <motion.div 
        style={{ y: fgY }}
        className="absolute inset-x-0 bottom-0 z-20 h-screen w-full"
      >
        <Image 
          src="/tree-foreground.png" 
          alt="Foreground Trees" 
          fill 
          className="object-cover object-top"
          priority
        />
      </motion.div>
    </div>
  );
}
