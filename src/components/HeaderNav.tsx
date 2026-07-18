"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, GalleryHorizontal, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when page route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Daily Challenge", color: "hover:text-monster-blue", icon: Sparkles },
    { href: "/blog", label: "Projects", color: "hover:text-monster-pink", icon: BookOpen },
    { href: "/classes", label: "Classes", color: "hover:text-monster-orange", icon: GraduationCap },
    { href: "/gallery", label: "Gallery", color: "hover:text-monster-pink", icon: GalleryHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md transform-gpu backface-hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 relative z-50">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Creative Monsters"
            width={180}
            height={40}
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium text-muted-foreground ${link.color} transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Toggle (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-black/5 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-monster-pink" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur and Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide Down Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute left-0 right-0 top-16 bg-white/95 backdrop-blur-lg border-b border-black/5 shadow-2xl z-40 md:hidden overflow-hidden"
            >
              <div className="container mx-auto px-6 py-8 flex flex-col gap-6 font-sans">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link, idx) => {
                    const IconComponent = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-monster-pink py-2 transition-colors border-b border-black/5"
                        >
                          <div className={`p-2 rounded-xl bg-gray-50 text-gray-500`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link
                    href="/upload"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-monster-blue py-4 text-center font-bold text-white shadow-xl shadow-monster-blue/20 hover:bg-monster-blue/90 active:scale-95 transition-all text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Share your art
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
