import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  fetchArticleBySlug, 
  fetchComments, 
  fetchArticles, 
  incrementArticleViews 
} from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleView from '@/components/ArticleView';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // Revalidate page every 5 minutes (ISR)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article non trouvé | Faso Diaspora",
      description: "L'article demandé est introuvable."
    };
  }

  return {
    title: `${article.title} | Faso Diaspora`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://faso-diaspora.vercel.app/articles/${slug}`,
      type: "article",
      publishedTime: article.created_at,
      authors: [article.author],
      images: [
        {
          url: `https://faso-diaspora.vercel.app/articles/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ]
    }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Increment views in background
  incrementArticleViews(slug).catch(err => console.error('Failed to increment views:', err));

  // Parallel fetches on server: Fetch comments and all articles to extract the sections
  const [comments, allArticles] = await Promise.all([
    fetchComments(article.id),
    fetchArticles()
  ]);

  const category = CATEGORIES.find(c => c.slug === article.category);
  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // 1. List of 5 other articles in the same category (excluding current)
  const sameCategoryArticles = allArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 5);

  // 2. List of 5 featured/popular articles on the site (excluding current, sorted by views)
  const featuredArticles = [...allArticles]
    .filter(a => a.id !== article.id)
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.image_url],
    "datePublished": article.created_at,
    "author": [{ "@type": "Person", "name": article.author }],
    "publisher": {
      "@type": "Organization",
      "name": "Faso Diaspora",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=200&h=200&q=80"
      }
    },
    "description": article.excerpt
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-burkina-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Article area (8/12 cols) */}
          <article className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            
            {/* Header metadata */}
            <div className="space-y-4">
              <span className="bg-burkina-red text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded">
                {category?.name || article.category}
              </span>
              <h1 className="font-black text-2xl md:text-3xl lg:text-4xl leading-tight font-display text-slate-900 dark:text-white">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-5 text-slate-400 text-xs font-bold pt-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 capitalize">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {article.read_time}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <p className="text-slate-650 dark:text-slate-350 font-bold text-sm md:text-base leading-relaxed border-l-4 border-burkina-red pl-4 py-1 italic">
              {article.excerpt}
            </p>

            {/* Interactive View Wrapper (accessibility zoom, social shares, comments) */}
            <ArticleView article={article} comments={comments} />

          </article>

          {/* Right Sidebar (4/12 cols) - Displays Same Category and Featured/Top Articles */}
          <div className="lg:col-span-4">
            <Sidebar 
              sameCategoryArticles={sameCategoryArticles} 
              featuredArticles={featuredArticles} 
            />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
