import { getClassById } from "@/app/actions/classes";
import { ClassRunnerClient } from "@/components/ClassRunnerClient";
import { notFound } from "next/navigation";
import { getApprovedSubmissionsForClass } from "@/app/actions/submissions";
import { UploadForm } from "@/components/UploadForm";
import Link from "next/link";

export default async function ClassIdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const classData = await getClassById(params.id);

  if (!classData) return notFound();

  // Fetch approved submissions specifically for this class
  const approvedSubmissions = await getApprovedSubmissionsForClass(params.id);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center max-w-4xl">
      {/* Back button */}
      <div className="w-full mb-6 flex justify-start">
        <Link href="/classes" className="text-gray-500 hover:text-monster-blue font-semibold flex items-center gap-2 transition-colors">
          ← Back to Classes
        </Link>
      </div>

      <ClassRunnerClient classData={classData} />

      {/* Grid containing Upload Form and Gallery of Approved Art */}
      <div id="upload-section" className="w-full mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
        {/* Left Side: Upload your art */}
        <div>
          <UploadForm classId={classData.id} classTitle={classData.title} />
        </div>

        {/* Right Side: Approved Artwork Gallery for this class */}
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
            Class Gallery 🎨
          </h2>
          {approvedSubmissions.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-500">
              <p className="font-semibold text-lg mb-2">Be the first to share your art!</p>
              <p className="text-sm">Once approved, your creation will show up in the class gallery right here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {approvedSubmissions.map((sub: any) => (
                <div key={sub.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-50 border border-gray-100 transition-all hover:scale-105 hover:shadow-lg">
                  <a href={sub.image_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img 
                      src={sub.image_url} 
                      alt={sub.monster_name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                      <p className="font-bold text-sm truncate">{sub.monster_name}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
