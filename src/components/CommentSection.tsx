'use client';

import React, { useState } from 'react';
import { Send, User, Calendar, MessageSquare } from 'lucide-react';
import { Comment } from '@/lib/types';

interface CommentSectionProps {
  articleId: string;
  initialComments: Comment[];
}

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          authorName: authorName.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setContent('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold font-display uppercase tracking-wider flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-burkina-red" />
        Commentaires ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Laisser un commentaire</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="commenter-name-input" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Nom complet</label>
            <input
              type="text"
              id="commenter-name-input"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ex: Salif Diallo"
              required
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:border-burkina-red dark:text-white"
            />
          </div>
        </div>
        <div>
          <label htmlFor="commenter-text-area" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Votre message</label>
          <textarea
            id="commenter-text-area"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre commentaire ici..."
            required
            rows={4}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:border-burkina-red dark:text-white resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-burkina-red text-white dark:bg-slate-800 dark:hover:bg-burkina-red font-bold text-xs md:text-sm py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
            id="submit-comment-btn"
          >
            {submitting ? 'Envoi...' : 'Publier le commentaire'}
            <Send className="w-3.5 h-3.5" />
          </button>
          {success && (
            <span className="text-xs text-emerald-500 font-semibold animate-pulse">
              Commentaire publié avec succès !
            </span>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-slate-400 text-xs md:text-sm italic">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-5 bg-card border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100">{comment.author_name}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm mt-2 leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
