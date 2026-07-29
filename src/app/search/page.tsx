import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { searchArticles, fetchRecentArticles } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleCard from '@/components/ArticleCard';
import { ArrowLeft } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Résultats de recherche pour "${q}" | Faso Diaspora` : "Recherche | Faso Diaspora",
    description: "Recherchez des articles d'actualité sur le Burkina Faso et sa diaspora."
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  
  const [results, recentArticles] = await Promise.all([
    searchArticles(q),
    fetchRecentArticles(5)
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 hover:text-burkina-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List of articles */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight flex items-center gap-2">
                <span className="w-3 h-8 bg-burkina-red rounded-sm"></span>
                Recherche
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2">
                {q ? `Résultats pour "${q}" : ${results.length} article(s) trouvé(s)` : "Entrez votre recherche ci-dessus."}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850">
                <p className="text-slate-400 text-sm italic">Aucun article ne correspond à votre recherche. Essayez d'autres mots-clés.</p>
                <Link href="/" className="inline-flex items-center gap-2 text-xs bg-slate-950 hover:bg-burkina-red text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                  Retour à l'accueil
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} layout="grid" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar recentArticles={recentArticles} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
