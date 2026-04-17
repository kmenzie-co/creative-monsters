import { getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import { Calendar, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ParallaxFooter } from "@/components/ParallaxFooter";
import ReactMarkdown from "react-markdown";

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publish_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-gray-100">
        <img
          src={post.hero_image_path}
          alt={post.hero_image_alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-12 left-0 w-full">
          <div className="container mx-auto px-4">
            <Link
              href="/blog"
              className="mb-8 flex items-center gap-2 text-sm font-bold text-white transition-transform hover:-translate-x-2 drop-shadow-md"
            >
              <ChevronLeft className="h-4 w-4 shadow-black" />
              Creation Station
            </Link>

            <div className="flex flex-col gap-6">
               <div className="flex flex-wrap gap-3">
                  {post.category_tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-black/40 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md uppercase tracking-wider border border-white/20 shadow-lg">
                      {tag}
                    </span>
                  ))}
               </div>

               <h1 className="max-w-4xl text-4xl font-display font-black text-white sm:text-5xl lg:text-7xl [text-shadow:0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
                 {post.title}
               </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-12 lg:flex-row">

          {/* Metadata Sidebar (on desktop) */}
          <aside className="lg:w-1/4 lg:shrink-0">
            <div className="sticky top-24 space-y-12">
               <div>
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Published</h4>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Calendar className="h-4 w-4 text-monster-blue" />
                    {publishedDate}
                  </div>
               </div>

               <div>
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.category_tags.map((tag: string) => (
                      <span key={tag} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </aside>
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="prose prose-lg max-w-none text-gray-700 prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-img:rounded-3xl prose-a:text-monster-blue prose-strong:text-gray-900 font-serif leading-relaxed">
               <ReactMarkdown>{post.body_markdown}</ReactMarkdown>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
         <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-2xl font-display font-bold text-gray-900 px-4 text-center">Ready for another adventure?</h2>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-full bg-monster-blue px-8 py-3.5 font-display font-bold text-white shadow-xl shadow-monster-blue/20 transition-transform hover:scale-105 active:scale-95">
               Back to Creation Station
            </Link>
         </div>
      </section>

      <ParallaxFooter />
    </article>
  );
}
