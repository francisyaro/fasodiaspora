'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import { Article } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

interface HeroCarouselProps {
  articles: Article[];
}

export default function HeroCarousel({ articles }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If no articles, render nothing
  if (!articles || articles.length === 0) return null;

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000); // Rotate every 6 seconds
  };

  const handleNext = () => {
    setFadeState('fade-out');
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % articles.length);
      setFadeState('fade-in');
    }, 450);
  };

  const handlePrev = () => {
    setFadeState('fade-out');
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + articles.length) % articles.length);
      setFadeState('fade-in');
    }, 450);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [articles.length]);

  const currentArticle = articles[activeIndex];
  const categoryName = CATEGORIES.find(c => c.slug === currentArticle.category)?.name || currentArticle.category;

  const formattedDate = new Date(currentArticle.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 relative min-h-[460px]">
      
      {/* Left Text Block (7/12 cols) */}
      <div className={`lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6 z-10 bg-white dark:bg-slate-900 transition-all duration-500 transform ${
        fadeState === 'fade-in' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}>
        <div className="space-y-4">
          <span className="bg-burkina-red text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded">
            {categoryName}
          </span>
          
          <h2 className="font-black text-2xl md:text-3xl lg:text-[36px] leading-tight tracking-tight text-slate-900 dark:text-white font-display">
            <Link href={`/articles/${currentArticle.slug}`} className="hover:text-burkina-red transition-colors">
              {currentArticle.title}
            </Link>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl line-clamp-3">
            {currentArticle.excerpt}
          </p>

          <div className="flex items-center gap-5 text-slate-400 text-xs font-bold pt-2">
            <span className="flex items-center gap-1.5 capitalize">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              {currentArticle.read_time}
            </span>
          </div>
        </div>

        <div>
          <Link 
            href={`/articles/${currentArticle.slug}`}
            className="inline-flex bg-burkina-red hover:bg-red-750 text-white font-black text-xs py-3.5 px-7 rounded shadow transition-colors uppercase tracking-wider"
          >
            Lire l'article
          </Link>
        </div>
      </div>

      {/* Right Image Mask Block (5/12 cols) */}
      <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden flex-shrink-0">
        
        {/* Background Red Skew Shapes */}
        <div 
          className="absolute inset-0 bg-burkina-red z-0 hidden lg:block"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
        ></div>
        <div 
          className="absolute inset-0 bg-white dark:bg-slate-900 z-10 hidden lg:block"
          style={{ clipPath: 'polygon(15% 0, 20% 0, 8% 100%, 0% 100%)' }}
        ></div>
        
        {/* Skewed Main Image with Transition */}
        <div 
          className="absolute inset-0 z-0 lg:z-10"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          <div 
            className={`w-full h-full lg:ml-[13%] transition-all duration-550 transform ${
              fadeState === 'fade-in' ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            }`}
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          >
            <img
              src={currentArticle.image_url}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Carousel indicators dots & navigation arrows */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3.5">
          {/* Arrows */}
          <div className="flex gap-2">
            <button 
              onClick={() => { handlePrev(); resetTimer(); }}
              className="w-8 h-8 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold transition-colors rounded shadow-sm"
              aria-label="Article précédent"
            >
              &lt;
            </button>
            <button 
              onClick={() => { handleNext(); resetTimer(); }}
              className="w-8 h-8 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold transition-colors rounded shadow-sm"
              aria-label="Article suivant"
            >
              &gt;
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 mr-1.5">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFadeState('fade-out');
                  setTimeout(() => {
                    setActiveIndex(idx);
                    setFadeState('fade-in');
                  }, 450);
                  resetTimer();
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex 
                    ? 'bg-burkina-red w-4' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller au slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
