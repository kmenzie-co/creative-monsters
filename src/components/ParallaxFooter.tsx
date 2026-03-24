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

  // 1. Background (bg.png): Moves slower than the scroll.
  // It starts slightly higher and moves down less than the scroll, making it feel distant.
  const bgY = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  
  // 3. Foreground (tree-foreground.png): Moves faster than the scroll.
  // It starts low and moves UP quickly to overlap the middle ground.
  const fgY = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <div ref={containerRef} className="relative w-full h-[800px] overflow-hidden pointer-events-none mt-24">
      {/* LAYER 1: Background Mountains (Slower) */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 z-0 h-[120%]"
      >
        <Image 
          src="/bg.png" 
          alt="Background Mountain Plane" 
          fill 
          className="object-cover object-bottom opacity-90"
          priority
        />
      </motion.div>

      {/* LAYER 2: Middle Ground Trees (Anchor - Inline 1:1) */}
      <div className="absolute inset-x-0 bottom-0 z-10 w-full h-full">
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
        className="absolute inset-x-0 -bottom-20 z-20 w-full h-[120%]"
      >
        <Image 
          src="/tree-foreground.png" 
          alt="Foreground Trees" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </motion.div>
    </div>
  );
}
