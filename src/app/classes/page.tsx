import { getClasses } from '@/app/actions/classes';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-center mb-4">Creative Classes</h1>
      <p className="text-gray-500 text-center mb-12">Select a class to generate your personalized learning experience!</p>

      {classes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <h3 className="text-xl font-bold text-gray-600">No classes found</h3>
          <p className="text-gray-500">Check back later when our teachers have uploaded new material!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((c: any) => (
            <Link key={c.id} href={`/classes/${c.id}`} className="group relative block overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={c.cover_art_url}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white font-bold text-shadow text-xl sm:text-2xl drop-shadow-md">{c.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm line-clamp-3">{c.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-monster-blue font-bold text-sm">Start Class →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
