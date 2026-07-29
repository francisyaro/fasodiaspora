'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, MessageSquare, Clock } from 'lucide-react';
import { Article } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

interface HeroGridProps {
  featuredArticles: Article[];
}

export default function HeroGrid({ featuredArticles }: HeroGridProps) {
  // We need exactly 3 articles. If we have less, we adapt, if more, we take first 3.
  const articles = featuredArticles.slice(0, 3);
  if (articles.length === 0) return null;

  const getCategoryDetails = (catSlug: string) => {
    return CATEGORIES.find(c => c.slug === catSlug);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* Large Featured Article (Left - spans 2 columns on large screen) */}
      <div className="lg:col-span-2 relative aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:h-[480px] rounded-2xl overflow-hidden shadow-lg group">
        <img
          src={articles[0].image_url}
          alt={articles[0].title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
        
        {/* Flag top-accent border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
          <div className="flex-1 bg-burkina-red"></div>
          <div className="flex-1 bg-burkina-green"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-burkina-red text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
              À LA UNE
            </span>
            <span className={`bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full border border-white/10`}>
              {getCategoryDetails(articles[0].category)?.name || articles[0].category}
            </span>
          </div>
          <h2 className="text-white font-extrabold text-xl md:text-2xl lg:text-3xl leading-snug tracking-tight font-display group-hover:text-burkina-yellow transition-colors duration-200 line-clamp-3">
            <Link href={`/articles/${articles[0].slug}`}>
              {articles[0].title}
            </Link>
          </h2>
          <p className="text-slate-200 text-xs md:text-sm mt-3 line-clamp-2 max-w-3xl">
            {articles[0].excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-300 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">{articles[0].author}</span>
              <span>•</span>
              <span>{formatDate(articles[0].created_at)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {articles[0].read_time}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1" title="Vues">
                <Eye className="w-3.5 h-3.5" />
                {articles[0].views_count}
              </span>
              <span className="flex items-center gap-1" title="Commentaires">
                <MessageSquare className="w-3.5 h-3.5" />
                {articles[0].comments_count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Smaller Articles Stacked (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {articles.slice(1, 3).map((article, idx) => (
          <div 
            key={article.id} 
            className="relative aspect-[16/10] md:aspect-auto lg:h-[228px] rounded-2xl overflow-hidden shadow-md group"
          >
            <img
              src={article.image_url}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`bg-black/55 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full border border-white/5`}>
                  {getCategoryDetails(article.category)?.name || article.category}
                </span>
              </div>
              <h3 className="text-white font-bold text-sm md:text-base leading-snug group-hover:text-burkina-yellow transition-colors duration-200 line-clamp-2">
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
              <div className="flex items-center justify-between text-[10px] text-slate-300 mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{article.author}</span>
                  <span>•</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5" title="Vues">
                    <Eye className="w-3 h-3" />
                    {article.views_count}
                  </span>
                  <span className="flex items-center gap-0.5" title="Commentaires">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {article.comments_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
