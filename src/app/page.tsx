import { DAILY_PROMPT, SUPPORTING_COPY } from "@/lib/constants";
import { getTodayPrompt } from "@/app/actions/submissions";
import { HomeHero } from "@/components/HomeHero";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbPrompt = await getTodayPrompt();
  
  const displayPrompt = dbPrompt || {
    title: DAILY_PROMPT.title,
    description: DAILY_PROMPT.description
  };

  return (
    <>
      <HomeHero 
        prompt={displayPrompt} 
        supportingCopy={SUPPORTING_COPY} 
      />
      
      <div className="fixed bottom-0 left-0 right-0 z-10 w-full h-[500px] pointer-events-none">
        <Image 
          src="/bg.png" 
          alt="Background Floor" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </div>
    </>
  );
}
