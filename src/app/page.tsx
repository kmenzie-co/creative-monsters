import { DAILY_PROMPT } from "@/lib/constants";
import { getRecentApprovedSubmissions, getTodayPrompt } from "@/app/actions/submissions";
import { getRecentClasses } from "@/app/actions/classes";
import { getRecentPublishedPosts } from "@/app/actions/blog";
import { HomeHero } from "@/components/HomeHero";
import { ParallaxFooter } from "@/components/ParallaxFooter";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [dbPrompt, galleryMonsters, recentClasses, recentPosts] = await Promise.all([
    getTodayPrompt(),
    getRecentApprovedSubmissions(5),
    getRecentClasses(3),
    getRecentPublishedPosts(3),
  ]);
  
  const displayPrompt = dbPrompt || {
    title: DAILY_PROMPT.title,
    description: DAILY_PROMPT.description
  };

  return (
    <div className="relative min-h-screen">
      <HomeHero 
        prompt={displayPrompt} 
        galleryMonsters={galleryMonsters}
        recentClasses={recentClasses}
        recentPosts={recentPosts}
      />
      <div className="-mt-12 overflow-visible">
        <ParallaxFooter />
      </div>
    </div>
  );
}
