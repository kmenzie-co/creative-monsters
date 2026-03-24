import { DAILY_PROMPT, SUPPORTING_COPY } from "@/lib/constants";
import { getTodayPrompt } from "@/app/actions/submissions";
import { HomeHero } from "@/components/HomeHero";
import { ParallaxFooter } from "@/components/ParallaxFooter";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbPrompt = await getTodayPrompt();
  
  const displayPrompt = dbPrompt || {
    title: DAILY_PROMPT.title,
    description: DAILY_PROMPT.description
  };

  return (
    <div className="relative min-h-screen">
      <HomeHero 
        prompt={displayPrompt} 
        supportingCopy={SUPPORTING_COPY} 
      />
      
      {/* Spacer to allow for scrolling the parallax layers into view */}
      <div className="h-[500px]" />
      
      <ParallaxFooter />
    </div>
  );
}
