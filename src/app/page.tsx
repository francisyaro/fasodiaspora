import React from 'react';
import { Eye, Calendar, Clock, ChevronRight, Play, Landmark } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import { fetchArticles } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';

export const revalidate = 300; // Revalidate page every 5 minutes (ISR)

export default async function HomePage() {
  const allArticles = await fetchArticles();

  // Find the 3 featured articles to rotate in the Hero Carousel
  const carouselArticles = allArticles.filter(a => a.is_featured).slice(0, 3);
  const carouselIds = carouselArticles.map(a => a.id);

  // Articles available for the rest of the homepage (no duplication)
  const nonCarouselArticles = allArticles.filter(a => !carouselIds.includes(a.id));

  // Find the 4 featured cards for "À LA UNE AUJOURD'HUI"
  const featuredCards = nonCarouselArticles.slice(0, 4);
  const featuredCardsIds = featuredCards.map(a => a.id);

  // Dynamic Trends: Top 9 articles sorted by views, excluding carousel articles
  const trends = [...allArticles]
    .filter(a => !carouselIds.includes(a.id))
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 9);

  // Hardcoded Dossiers data matching screenshot exactly
  const dossiers = [
    {
      category: "SÉCURITÉ",
      title: "Sécurité au Sahel : les enjeux de la stabilité",
      image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80"
    },
    {
      category: "DOSSIER",
      title: "Économie & développement : panorama des secteurs porteurs du Faso",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // List of categories to display in the grid format requested
  const homeCategories = [
    { slug: 'culture', name: 'Arts et Culture' },
    { slug: 'education', name: 'Éducation' },
    { slug: 'politique', name: 'Politique' },
    { slug: 'societe', name: 'Société' },
    { slug: 'sport', name: 'Sport' },
    { slug: 'portrait', name: 'Portrait' },
    { slug: 'reussite', name: 'Réussite' }
  ];

  const getCategoryName = (slug: string) => {
    return CATEGORIES.find(c => c.slug === slug)?.name || slug;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        
        {/* 1. HERO SECTION: Dynamic Automated Carousel (3 articles, no repetition) */}
        <HeroCarousel articles={carouselArticles} />

        {/* 2. À LA UNE AUJOURD'HUI Section (4-column grid of dark overlay cards) */}
        <section className="space-y-6">
          <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-900 dark:text-white border-l-4 border-burkina-red pl-3.5 font-display">
            À LA UNE AUJOURD'HUI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCards.map((article) => (
              <div key={article.id} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow group">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-101 transition-transform duration-550"
                  loading="lazy"
                />
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white space-y-2">
                  <span className="bg-burkina-red text-white text-[8px] font-black uppercase tracking-wider py-0.5 px-2 rounded-sm w-fit">
                    {getCategoryName(article.category)}
                  </span>
                  <h4 className="font-bold text-xs md:text-sm leading-snug group-hover:text-burkina-yellow transition-colors line-clamp-2 cursor-pointer">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                  <span className="text-[9px] text-slate-300 font-semibold">
                    {new Date(article.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TENDANCES vs DOSSIERS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: TENDANCES (9 Items) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-red pl-3.5 mb-2 font-display">
              TENDANCES
            </h3>
            
            <div className="space-y-4 flex-1">
              {trends.map((item, idx) => (
                <div key={item.id} className="flex gap-4 group items-start border-b border-slate-50 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                  <span className="text-lg font-black text-burkina-red/35 dark:text-red-900/50 font-display">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-burkina-red transition-colors line-clamp-2 cursor-pointer leading-snug">
                      <Link href={`/articles/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">{item.views_count} vues</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: DOSSIERS À LA UNE (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-red pl-3.5 font-display">
              DOSSIERS À LA UNE
            </h3>

            <div className="space-y-6">
              {dossiers.map((doss, idx) => (
                <div key={idx} className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow group">
                  <img
                    src={doss.image}
                    alt={doss.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/45 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white space-y-3">
                    <span className="bg-burkina-red text-white text-[8px] font-black uppercase tracking-wider py-0.5 px-2 rounded-sm w-fit">
                      {doss.category}
                    </span>
                    <h4 className="font-bold text-sm md:text-base lg:text-lg leading-snug group-hover:text-burkina-yellow transition-colors max-w-xl">
                      {doss.title}
                    </h4>
                    <button className="bg-burkina-red hover:bg-red-750 text-white font-extrabold text-[9px] py-2 px-4 rounded tracking-wider uppercase w-fit mt-1">
                      LIRE LE DOSSIER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* 4. CATEGORIES STACKED SECTIONS - Formatting requested by category */}
        {homeCategories.map((cat) => {
          // Fetch articles inside this category, excluding carousel articles to avoid repeating
          const catArticles = allArticles.filter(
            a => a.category === cat.slug && !carouselIds.includes(a.id)
          );

          if (catArticles.length === 0) return null;

          const mainArticle = catArticles[0];
          const listArticles = catArticles.slice(1, 4);

          return (
            <section key={cat.slug} className="space-y-6">
              <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-900 dark:text-white border-l-4 border-burkina-red pl-3.5 font-display">
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left block (2/3 width) - Split horizontal card */}
                {mainArticle && (
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group">
                    <div className="relative w-full md:w-[45%] aspect-video md:aspect-auto min-h-[220px] md:min-h-full overflow-hidden flex-shrink-0">
                      <img
                        src={mainArticle.image_url}
                        alt={mainArticle.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          <span className="text-burkina-red">{cat.name}</span>
                          <span>
                            {new Date(mainArticle.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="font-black text-lg md:text-xl text-slate-850 dark:text-slate-100 group-hover:text-burkina-red transition-colors leading-snug line-clamp-2">
                          <Link href={`/articles/${mainArticle.slug}`}>
                            {mainArticle.title}
                          </Link>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-450 text-xs md:text-sm leading-relaxed line-clamp-4">
                          {mainArticle.excerpt}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link 
                          href={`/articles/${mainArticle.slug}`} 
                          className="inline-flex items-center gap-1 text-xs font-black text-burkina-red hover:underline uppercase tracking-wider"
                        >
                          Lire l'article
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right block (1/3 width) - Vertical list of 3 small items */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4 justify-between flex flex-col">
                  {listArticles.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-slate-400 italic text-xs">
                      Pas d'autres articles dans cette catégorie
                    </div>
                  ) : (
                    listArticles.map((art) => (
                      <div key={art.id} className="flex gap-3 group cursor-pointer items-start border-b border-slate-100 dark:border-slate-800 pb-3.5 last:border-0 last:pb-0">
                        <img
                          src={art.image_url}
                          alt={art.title}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0 group-hover:opacity-85 transition-opacity"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 group-hover:text-burkina-red transition-colors line-clamp-2 leading-snug">
                            <Link href={`/articles/${art.slug}`}>
                              {art.title}
                            </Link>
                          </h4>
                          <p className="text-[10px] text-slate-450 mt-1.5 font-semibold">
                            {new Date(art.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </section>
          );
        })}

      </main>

      <Footer />
    </div>
  );
}
