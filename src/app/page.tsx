import { DAILY_PROMPT, SUPPORTING_COPY } from "@/lib/constants";
import { getTodayPrompt } from "@/app/actions/submissions";
import { HomeHero } from "@/components/HomeHero";

export default async function Home() {
  const dbPrompt = await getTodayPrompt();
  
  const displayPrompt = dbPrompt || {
    title: DAILY_PROMPT.title,
    description: DAILY_PROMPT.description
  };

  return (
    <HomeHero 
      prompt={displayPrompt} 
      supportingCopy={SUPPORTING_COPY} 
    />
  );
}
