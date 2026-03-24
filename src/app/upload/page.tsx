import { DAILY_PROMPT } from "@/lib/constants";
import { getTodayPrompt } from "@/app/actions/submissions";
import { UploadForm } from "@/components/UploadForm";

export default async function UploadPage() {
  const dbPrompt = await getTodayPrompt();
  
  const displayPrompt = dbPrompt || {
    title: DAILY_PROMPT.title,
    description: DAILY_PROMPT.description
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 max-w-2xl">
      <UploadForm prompt={displayPrompt} />
    </div>
  );
}
