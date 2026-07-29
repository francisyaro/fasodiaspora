'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

export default function BreakingNewsTicker() {
  const [items, setItems] = useState<{ title: string; slug?: string }[]>([
    { title: "Burkina Faso : Vers une souveraineté économique durable et inclusive" },
    { title: "SIAO 2024 : L'artisanat africain mis à l'honneur à Ouagadougou" },
    { title: "CAN 2025 : Les Étalons entament leur stage de préparation en Europe" },
    { title: "Coopération : Le ministre des Affaires étrangères en mission diplomatique" },
    { title: "Solidarité : La diaspora se mobilise au consulat d'Abidjan pour l'effort de paix" }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    // Fetch real articles from the local API route
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map to display items
          const mapped = data.map((art: Article) => ({
            title: art.title,
            slug: art.slug
          }));
          setItems(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch breaking news articles:', err));
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setFadeState('fade-in');
      }, 500);
      
    }, 5000); // Change headline every 5 seconds

    return () => clearInterval(interval);
  }, [items]);

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <div className="flex-1 overflow-hidden h-5 flex items-center relative select-none">
      <div 
        className={`text-slate-200 hover:text-burkina-yellow font-bold tracking-tight text-xs md:text-sm transition-all duration-500 transform cursor-pointer ${
          fadeState === 'fade-in' 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-2 scale-98'
        }`}
      >
        {currentItem.slug ? (
          <Link href={`/articles/${currentItem.slug}`}>
            {currentItem.title}
          </Link>
        ) : (
          <span>{currentItem.title}</span>
        )}
      </div>
    </div>
  );
}
