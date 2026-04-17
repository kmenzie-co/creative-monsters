import { getPublishedPosts } from "@/app/actions/blog";
import { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://creativemonsters.com';

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publish_date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routes = [
    '',
    '/gallery',
    '/upload',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  return [...routes, ...blogPosts];
}
