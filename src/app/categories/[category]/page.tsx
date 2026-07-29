import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticlesByCategory, fetchArticles } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 300; // Revalidate page every 5 minutes (ISR)

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find(c => c.slug === categorySlug);

  if (!category) {
    return {
      title: "Catégorie inconnue | Faso Diaspora"
    };
  }

  return {
    title: `${category.name} - Actualités | Faso Diaspora`,
    description: `Retrouvez toutes les actualités et analyses sur le thème de ${category.name} concernant le Burkina Faso et sa diaspora.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find(c => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  // Fetch articles for this category, and all articles for side lists
  const [categoryArticles, allArticles] = await Promise.all([
    fetchArticlesByCategory(categorySlug),
    fetchArticles()
  ]);

  // Sidebar trends matching homepage
  const sideTrends = allArticles.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Back Link */}
        <div>
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
          
          {/* Left: Articles List (8/12 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category Header Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 md:p-8 shadow-sm space-y-2 border-t-4 border-burkina-red">
              <h1 className="text-2xl md:text-3xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
                Actualités : {category.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Toute l'information du Burkina Faso et de la diaspora concernant le domaine : <strong>{category.name}</strong>.
              </p>
            </div>

            {/* Articles Grid */}
            {categoryArticles.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl">
                <p className="text-slate-400 text-sm italic">Aucun article n'a été publié pour l'instant dans cette catégorie.</p>
                <Link href="/" className="inline-flex items-center gap-2 text-xs bg-burkina-red hover:bg-red-750 text-white py-2.5 px-5 rounded font-black uppercase transition-colors">
                  Retour à l'accueil
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categoryArticles.map((article) => (
                  <div key={article.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow group">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white space-y-2">
                      <h3 className="font-extrabold text-sm md:text-base leading-snug group-hover:text-burkina-yellow transition-colors line-clamp-2">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-slate-300 font-semibold mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(article.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.read_time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right: Sidebar Trends (4/12 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TENDANCES WIDGET */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-red pl-3.5 mb-5 font-display">
                À LA UNE AUJOURD'HUI
              </h3>
              
              <div className="space-y-4">
                {sideTrends.map((art, idx) => (
                  <div key={art.id} className="flex gap-3 group items-start border-b border-slate-50 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                    <span className="text-base font-black text-burkina-red/35 dark:text-red-900/50 font-display">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-burkina-red transition-colors line-clamp-2 cursor-pointer leading-snug">
                        <Link href={`/articles/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">{art.read_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
