import { getPublishedPosts } from "@/app/actions/blog";
import { BlogCard } from "@/components/BlogCard";
import { ParallaxFooter } from "@/components/ParallaxFooter";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[#FDFCF8] pt-12">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-display font-extrabold text-gray-900 tracking-tight sm:text-6xl lg:text-7xl">
          Creation <span className="text-monster-blue">Station 🎨</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
          Spark your child's imagination with monsters, crafts, and creativity!
          Explore our weekly batch of creative activities.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-32">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 bg-white/40 p-8 rounded-[3rem] border border-white/60 shadow-inner backdrop-blur-md">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-monster-blue/10 text-monster-blue">
              <span className="text-4xl">🎨</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2 px-4 text-center">No posts found</h2>
            <p className="text-gray-500 mb-8 px-4 text-center">Check back later for new creative adventures!</p>
          </div>
        )}
      </section>

      <ParallaxFooter />
    </main>
  );
}

