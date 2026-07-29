'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CloudSun, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Article } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from './ArticleCard';

interface SidebarProps {
  recentArticles?: Article[];
  sameCategoryArticles?: Article[];
  featuredArticles?: Article[];
}

export default function Sidebar({ recentArticles, sameCategoryArticles, featuredArticles }: SidebarProps) {
  const [weatherData] = useState({
    ouaga: { temp: '32°C', condition: 'Ensoleillé' },
    paris: { temp: '21°C', condition: 'Partiellement nuageux' },
    ny: { temp: '26°C', condition: 'Pluvieux' },
  });

  return (
    <aside className="w-full space-y-8 lg:sticky lg:top-6">
      
      {/* Interactive Diaspora Weather widget */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 shadow-md border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <CloudSun className="w-24 h-24 text-burkina-yellow" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-burkina-yellow flex items-center gap-1.5 mb-4">
            <CloudSun className="w-4 h-4" />
            Météo de la Diaspora
          </h3>
          <div className="space-y-3.5 divide-y divide-slate-800">
            <div className="flex justify-between items-center pt-0 first:pt-0">
              <span className="text-xs font-semibold text-slate-300">Ouagadougou (Burkina)</span>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{weatherData.ouaga.temp}</div>
                <div className="text-[10px] text-slate-400">{weatherData.ouaga.condition}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-xs font-semibold text-slate-300">Paris (Europe)</span>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{weatherData.paris.temp}</div>
                <div className="text-[10px] text-slate-400">{weatherData.paris.condition}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-xs font-semibold text-slate-300">New York (Amérique)</span>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{weatherData.ny.temp}</div>
                <div className="text-[10px] text-slate-400">{weatherData.ny.condition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Space (300 x 250) */}
      <div className="w-full aspect-[4/3] bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden p-6 shadow-sm">
        <span className="absolute top-2 left-3 text-[9px] uppercase font-bold text-slate-400 tracking-wider">Publicité</span>
        <div className="text-center space-y-2">
          <div className="text-slate-400 dark:text-slate-600 font-extrabold text-lg">300 x 250</div>
          <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs">
            Boostez la visibilité de votre entreprise auprès de la diaspora burkinabè.
          </p>
          <a href="#" className="inline-flex items-center gap-1 text-[11px] font-bold text-burkina-red hover:underline">
            Nous contacter <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 1. Same Category Articles (5 items) */}
      {sameCategoryArticles && sameCategoryArticles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-red pl-3 font-display">
            Dans la même rubrique
          </h3>
          <div className="space-y-4">
            {sameCategoryArticles.slice(0, 5).map((article) => (
              <div key={article.id} className="flex gap-3 group items-start">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 group-hover:opacity-85 transition-opacity"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 group-hover:text-burkina-red transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Featured Articles (5 items) */}
      {featuredArticles && featuredArticles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-l-4 border-burkina-green pl-3 font-display">
            Articles à la une
          </h3>
          <div className="space-y-4">
            {featuredArticles.slice(0, 5).map((article) => (
              <div key={article.id} className="flex gap-3 group items-start">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 group-hover:opacity-85 transition-opacity"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 group-hover:text-burkina-green transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback: default articles */}
      {!sameCategoryArticles && !featuredArticles && recentArticles && recentArticles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-burkina-red" />
            Articles Récents
          </h3>
          <div className="space-y-4">
            {recentArticles.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} layout="minimal" />
            ))}
          </div>
        </div>
      )}

      {/* Categories Badge List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-burkina-green" />
          Catégories
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/categories/${cat.slug}`}
              className="text-xs font-semibold py-2 px-3.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-burkina-red hover:text-white dark:hover:bg-burkina-red dark:hover:text-white transition-all duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}
