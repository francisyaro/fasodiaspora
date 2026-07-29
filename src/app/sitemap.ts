import { MetadataRoute } from 'next';
import { fetchArticles } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://faso-diaspora.vercel.app';

  // Base URLs
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
  ];

  // Category URLs
  CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  // Dynamic Article URLs
  try {
    const articles = await fetchArticles();
    articles.forEach((art) => {
      routes.push({
        url: `${baseUrl}/articles/${art.slug}`,
        lastModified: new Date(art.created_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap dynamic routes:', error);
  }

  return routes;
}
