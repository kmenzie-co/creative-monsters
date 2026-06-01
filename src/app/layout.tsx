import type { Metadata } from "next";
import { Outfit, Fredoka } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { PostHogProvider } from "@/providers/PostHogProvider";
import PostHogPageView from "@/components/PostHogPageView";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { HeaderNav } from "@/components/HeaderNav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Monsters | Share Your Creation!",
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
      <body className="min-h-full overflow-x-hidden flex flex-col bg-background text-foreground selection:bg-monster-pink/30">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18195705961"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18195705961');
          `}
        </Script>

        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <HeaderNav />

          <main className="flex-1 relative isolate">
            {children}
          </main>

          <footer className="w-full border-t border-black/5 bg-white/40 backdrop-blur-md relative z-10 py-6">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-sm text-muted-foreground">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center md:text-left">
                <span>© {new Date().getFullYear()} Creative Monsters.</span>
                <span className="hidden sm:inline text-black/10">|</span>
                <span>Made with ✨ and imagination for kids everywhere.</span>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/privacy"
                  className="hover:text-monster-pink transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/gallery"
                  className="hover:text-monster-blue transition-colors font-medium"
                >
                  Gallery
                </Link>
              </div>
            </div>
          </footer>

          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="blob-animation absolute -top-[10%] -left-[10%] h-[800px] w-[800px] rounded-full bg-monster-blue/10 blur-3xl" />
            <div className="blob-animation absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-monster-pink/10 blur-3xl [animation-delay:2s]" />
            <div className="blob-animation absolute -bottom-[10%] left-[20%] h-[1000px] w-[1000px] rounded-full bg-monster-orange/5 blur-3xl [animation-delay:4s]" />
          </div>
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
