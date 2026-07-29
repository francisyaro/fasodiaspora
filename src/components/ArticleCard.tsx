'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageSquare, Clock, Calendar } from 'lucide-react';
import { Article } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

interface ArticleCardProps {
  article: Article;
  layout?: 'grid' | 'list' | 'minimal';
}

export default function ArticleCard({ article, layout = 'grid' }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === article.category);
  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (layout === 'minimal') {
    return (
      <div className="group border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${category?.color || 'text-burkina-red'}`}>
          {category?.name || article.category}
        </span>
        <h4 className="font-semibold text-sm leading-snug text-slate-800 dark:text-slate-200 group-hover:text-burkina-red transition-colors duration-200 mt-1 line-clamp-2">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.read_time}
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="flex gap-4 items-center group bg-card border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden p-3 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
        <Link href={`/articles/${article.slug}`} className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${category?.color || 'text-burkina-red'}`}>
            {category?.name || article.category}
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug group-hover:text-burkina-red transition-colors duration-200 mt-1 line-clamp-2">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mt-3 pt-2 border-t border-slate-50 dark:border-slate-900">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{article.author}</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5" title="Vues">
                <Eye className="w-3.5 h-3.5" />
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
    );
  }

  // Grid layout (default)
  return (
    <div className="flex flex-col h-full bg-card border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group">
      <Link href={`/articles/${article.slug}`} className="relative w-full aspect-video overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {article.is_breaking && (
          <span className="absolute top-3 left-3 bg-burkina-red text-white text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full shadow-md animate-pulse">
            Direct
          </span>
        )}
      </Link>
      <div className="flex flex-col flex-1 p-5">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${category?.color || 'text-burkina-red'}`}>
          {category?.name || article.category}
        </span>
        <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 leading-snug group-hover:text-burkina-red transition-colors duration-200 mt-2 line-clamp-2">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Vues">
              <Eye className="w-3.5 h-3.5" />
              {article.views_count}
            </span>
            <span className="flex items-center gap-1" title="Commentaires">
              <MessageSquare className="w-3.5 h-3.5" />
              {article.comments_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
