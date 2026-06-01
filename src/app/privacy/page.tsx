import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, FileText, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Creative Monsters",
  description: "How we keep our Monster World safe, secure, and fun for creative kids.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative whimsical shapes in the background */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-monster-pink/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-monster-blue/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-monster-pink/10 rounded-full mb-4">
            <Shield className="w-10 h-10 text-monster-pink" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display text-foreground mb-4">
            Monster-Safe Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
            We are dedicated to providing a safe, magical, and private space for kids to share their offline crafts and drawings. Here is how we protect your child&apos;s digital safety.
          </p>
          <div className="mt-4 text-sm text-muted-foreground/80">
            Last Updated: June 1, 2026
          </div>
        </div>

        {/* Quick Summary Cards (The "TL;DR" for Busy Parents) */}
        <div className="mb-12">
          <h2 className="text-2xl font-display text-foreground mb-6 text-center">
            🎨 The Quick & Simple Summary
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-md flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-monster-blue/10 text-monster-blue mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display mb-2 text-foreground">Human Moderated</h3>
              <p className="text-sm text-muted-foreground font-sans">
                Every single drawing is human-reviewed. We filter out any photos showing faces, names, or addresses before they go public.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 border border-black/5 shadow-md flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-monster-pink/10 text-monster-pink mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display mb-2 text-foreground">100% Private Names</h3>
              <p className="text-sm text-muted-foreground font-sans">
                Child names entered for video classes are kept strictly private. They are never shared publicly or visible to other users.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Section */}
        <div className="bg-white/95 backdrop-blur-md border border-black/5 rounded-3xl p-8 sm:p-12 shadow-xl font-sans text-foreground">
          <div className="prose max-w-none">
            
            <section className="mb-10">
              <h3 className="text-2xl font-display text-foreground flex items-center gap-2 mb-4 border-b border-black/5 pb-2">
                <FileText className="w-6 h-6 text-monster-blue" />
                1. COPPA & Child Safety Commitment
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Creative Monsters is designed to inspire kids with offline hands-on challenges. Because our application is geared towards young creators, we prioritize absolute compliance with the <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong> and global child protection frameworks.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>No Direct Communication:</strong> We do not offer direct messaging, comments, or forums. This prevents any cyberbullying or unsolicited contact.
                </li>
                <li>
                  <strong>Commitment to Anonymity:</strong> We only ask for a creative name for the artwork (e.g., &quot;The Speedy Spaceship&quot;). We do not collect names, nicknames, or any personal details from kids for public art submissions.
                </li>
                <li>
                  <strong>Strict Image Filtering:</strong> Our moderation portal requires a real human to inspect every photo. Any submission containing a child&apos;s face, house address, school logo, or other identifying marks will be promptly rejected.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-display text-foreground flex items-center gap-2 mb-4 border-b border-black/5 pb-2">
                <Eye className="w-6 h-6 text-monster-pink" />
                2. Information We Collect
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To run our application and show off your child&apos;s creativity, we only collect the minimum required data:
              </p>
              <div className="bg-background/50 rounded-2xl p-6 border border-black/5 space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">📷 Uploaded Art & Metadata</h4>
                  <p className="text-sm text-muted-foreground">
                    The photo of the drawing or physical monster craft, along with a <strong>name for the artwork</strong> (e.g., &quot;Sparky the Monster&quot;) and the optional <strong>class ID</strong> (if submitted as part of a creative class). We do not collect or store the child&apos;s name or nickname for art uploads.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">🎬 Custom Video Classes</h4>
                  <p className="text-sm text-muted-foreground">
                    When starting a custom video class, we collect the child&apos;s first name (e.g., &quot;Sammy&quot;). This allows our virtual character, Fig, to address the child directly by name in the class video generated via RunwayML. <strong>This name and the custom video are kept strictly private, stored temporarily, and are never shared with any other user of the app.</strong>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">📈 Aggregate Usage Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    We use PostHog to track anonymous events (such as when the gallery is viewed or an upload succeeds). This contains no personally identifiable data and is used solely to understand site performance and page engagement.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                <strong>We NEVER collect:</strong> Real-time location/GPS tracking, email addresses from children, phone numbers, physical addresses, school details, or browser histories.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-2xl font-display text-foreground flex items-center gap-2 mb-4 border-b border-black/5 pb-2">
                <CheckCircle className="w-6 h-6 text-monster-orange" />
                3. How We Use and Share Information
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Information is only shared publicly once it is explicitly approved by our human moderators. Only the approved art and the monster&apos;s artwork name will appear on our public gallery. No personal names or nicknames are ever published.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We partner with a few trusted services to help us run our app safely:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>
                  <strong>Supabase:</strong> Our database and secure file storage host. Your uploaded photos are stored here.
                </li>
                <li>
                  <strong>PostHog:</strong> Provides product telemetry to help us debug errors and make navigation simpler.
                </li>
                <li>
                  <strong>RunwayML:</strong> Processes static images to generate animated avatars (only when this option is triggered by a user).
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We will never rent, sell, or trade your child&apos;s information or uploaded art to advertisers or external marketing platforms.
              </p>
            </section>

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-monster-blue transition-colors gap-1.5"
          >
            ← Back to the Home Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
