'use client';

import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Article } from '@/lib/types';

interface NewsTickerProps {
  breakingArticles: Article[];
}

export default function NewsTicker({ breakingArticles }: NewsTickerProps) {
  if (!breakingArticles || breakingArticles.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white border-y border-slate-800 text-xs md:text-sm font-medium py-2.5 px-4 overflow-hidden flex items-center relative z-20 shadow-sm">
      <div className="flex items-center gap-1.5 bg-burkina-red text-white py-1 px-3 rounded-full text-xs uppercase font-extrabold tracking-wider mr-4 shadow-sm animate-pulse flex-shrink-0 z-10">
        <Flame className="w-3.5 h-3.5 fill-current" />
        Dernière Minute
      </div>
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="flex gap-16 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
          {breakingArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className="hover:text-burkina-yellow transition-colors duration-200"
            >
              • &nbsp; <span className="text-slate-400 mr-1">[{article.read_time}]</span> {article.title}
            </Link>
          ))}
          {/* Duplicate to create seamless marquee loop */}
          {breakingArticles.map((article) => (
            <Link 
              key={`${article.id}-dup`} 
              href={`/articles/${article.slug}`}
              className="hover:text-burkina-yellow transition-colors duration-200"
            >
              • &nbsp; <span className="text-slate-400 mr-1">[{article.read_time}]</span> {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
