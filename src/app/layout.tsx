import type { Metadata } from "next";
import { Outfit, Fredoka } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Monsters | Show Your Creation!",
  description: "A magical place for kids to share their daily creations.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-monster-pink/30">
        <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
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
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link 
                href="/gallery" 
                className="text-sm sm:text-base font-medium text-muted-foreground hover:text-monster-pink transition-colors"
              >
                Gallery
              </Link>
              <Link 
                href="/upload" 
                className="rounded-full bg-monster-blue px-4 py-1.5 text-sm sm:text-base font-medium text-white shadow-lg shadow-monster-blue/20 hover:bg-monster-blue/90 transition-all hover:scale-105 active:scale-95"
              >
                Share your art
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <div className="fixed bottom-0 left-0 right-0 -z-50 w-full h-[400px] pointer-events-none">
          <Image 
            src="/bg.png" 
            alt="Background" 
            fill 
            className="object-cover object-bottom"
            priority
          />
        </div>
      </body>
    </html>
  );
}
