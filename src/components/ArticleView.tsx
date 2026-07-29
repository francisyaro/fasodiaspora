'use client';

import React, { useState } from 'react';
import { Share2, Plus, Minus, Check } from 'lucide-react';
import CommentSection from './CommentSection';
import { Article, Comment } from '@/lib/types';

interface ArticleViewProps {
  article: Article;
  comments: Comment[];
}

export default function ArticleView({ article, comments }: ArticleViewProps) {
  const [fontSize, setFontSize] = useState<number>(14); // Default 14px text
  const [copied, setCopied] = useState(false);

  const handleZoomIn = () => {
    if (fontSize < 22) setFontSize(prev => prev + 2);
  };

  const handleZoomOut = () => {
    if (fontSize > 12) setFontSize(prev => prev - 2);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Article Utility Bar: Accessibility & Sharing */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-xl shadow-sm text-xs font-semibold text-slate-500 dark:text-slate-400">
        
        {/* Accessibility (Zoom font size) */}
        <div className="flex items-center gap-2">
          <span>Taille du texte :</span>
          <button 
            onClick={handleZoomOut} 
            disabled={fontSize <= 12}
            className="w-7 h-7 bg-slate-100 hover:bg-slate-250 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-colors"
            title="Diminuer la police"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold">{fontSize}px</span>
          <button 
            onClick={handleZoomIn} 
            disabled={fontSize >= 22}
            className="w-7 h-7 bg-slate-100 hover:bg-slate-250 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-colors"
            title="Agrandir la police"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sharing */}
        <div className="flex items-center gap-3">
          <span>Partager :</span>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 py-1.5 px-3.5 rounded-lg transition-colors"
            id="share-article-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copier le lien</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* 2. Article Content Body */}
      <div 
        className="prose prose-slate dark:prose-invert max-w-none leading-relaxed space-y-4 text-slate-750 dark:text-slate-300 font-sans"
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tag List */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-850">
          {article.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 3. Comments section */}
      <CommentSection articleId={article.id} initialComments={comments} />

    </div>
  );
}
