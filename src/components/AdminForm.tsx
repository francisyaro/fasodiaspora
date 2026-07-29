'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, Plus, ArrowLeft, RefreshCw, LogOut, 
  Trash2, Edit, FileText, Image as ImageIcon, Search, Eye
} from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function AdminForm() {
  // Views navigation: 'list' | 'create' | 'edit'
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  // Filters for list
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'pending' | 'trash'>('all');

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Rédaction Faso Diaspora');
  const [category, setCategory] = useState('politique');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=800&q=80');
  const [readTime, setReadTime] = useState('4 min');
  const [tags, setTags] = useState('Burkina, Diaspora');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [status, setStatus] = useState<'draft' | 'pending' | 'published' | 'trash'>('published');

  // Action states
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBody, setUploadingBody] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch articles on mount and view list
  useEffect(() => {
    if (view === 'list') {
      loadArticles();
    }
  }, [view]);

  const loadArticles = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/articles?all=true');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        console.error('Erreur lors du chargement des articles');
      }
    } catch (err) {
      console.error('Erreur réseau articles :', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'diaspora-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
    router.refresh();
  };

  const handleSuggestImage = () => {
    const images: Record<string, string> = {
      'culture': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
      'education': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      'politique': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      'societe': 'https://images.unsplash.com/photo-1531206715517-5c0ba2907890?auto=format&fit=crop&w=800&q=80',
      'sport': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      'portrait': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'reussite': 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    };
    setImageUrl(images[category] || images['politique']);
  };

  // Helper function to upload files dynamically
  const handleUploadFile = async (file: File): Promise<string> => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // Attempt upload to 'media' bucket
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('media').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        } else {
          console.warn('Supabase storage upload error, using local base64 fallback:', uploadError.message);
        }
      }
    } catch (err) {
      console.warn('Supabase client unavailable, using local base64 fallback:', err);
    }

    // Client-side fallback: Convert to base64 Data URL (fully works offline and saves to db.json)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload cover photo
  const handleCoverUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg('');
    try {
      const publicUrl = await handleUploadFile(file);
      setImageUrl(publicUrl);
      setSuccessMsg('Image de couverture chargée avec succès.');
    } catch (err) {
      setErrorMsg('Erreur lors du chargement de la couverture.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload image to append inside post body
  const handleBodyUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBody(true);
    setErrorMsg('');
    try {
      const publicUrl = await handleUploadFile(file);
      
      // Construct HTML tag to insert
      const imageHtml = `\n<img src="${publicUrl}" alt="" class="rounded-xl w-full my-6 shadow-sm" />\n`;

      // Insert at current cursor position in the textarea
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        const newText = currentText.substring(0, start) + imageHtml + currentText.substring(end);
        setContent(newText);
        
        // Return focus to textarea and adjust cursor
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + imageHtml.length;
        }, 100);
      } else {
        setContent(prev => prev + imageHtml);
      }
      setSuccessMsg('Image insérée dans le corps avec succès.');
    } catch (err) {
      setErrorMsg("Erreur lors de l'insertion de l'image.");
    } finally {
      setUploadingBody(false);
      // Clear input
      e.target.value = '';
    }
  };

  // Switch to creation view
  const triggerCreateView = () => {
    setCurrentArticleId(null);
    setTitle('');
    setAuthor('Rédaction Faso Diaspora');
    setCategory('politique');
    setImageUrl('https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=800&q=80');
    setReadTime('4 min');
    setTags('Burkina, Diaspora');
    setExcerpt('');
    setContent('');
    setIsFeatured(false);
    setIsBreaking(false);
    setStatus('published');
    setErrorMsg('');
    setSuccessMsg('');
    setView('create');
  };

  // Switch to edit view and load current data
  const triggerEditView = (article: Article) => {
    setCurrentArticleId(article.id);
    setTitle(article.title);
    setAuthor(article.author);
    setCategory(article.category);
    setImageUrl(article.image_url);
    setReadTime(article.read_time);
    setTags(article.tags?.join(', ') || 'Burkina, Diaspora');
    setExcerpt(article.excerpt);
    
    // Reverse paragraphs grouping conversion back to raw text if needed
    let rawContent = article.content || '';
    rawContent = rawContent
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br \/>/g, '\n')
      .trim();
    setContent(rawContent);

    setIsFeatured(article.is_featured);
    setIsBreaking(article.is_breaking);
    setStatus(article.status || 'published');
    setErrorMsg('');
    setSuccessMsg('');
    setView('edit');
  };

  // Delete article
  const handleDeleteArticle = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer définitivement l'article :\n"${name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg('Article supprimé avec succès.');
        loadArticles();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      setErrorMsg('Erreur réseau lors de la suppression.');
    }
  };

  // Submit article create/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Formatter paragraphs: wrap double newlines into p and single into br
    const paragraphs = content
      .split('\n\n')
      .map(p => {
        if (!p.trim()) return '';
        // If it's already an img tag, don't wrap it with p, keep it raw!
        if (p.trim().startsWith('<img') && p.trim().endsWith('/>')) {
          return p.trim();
        }
        return `<p>${p.replace(/\n/g, '<br />')}</p>`;
      })
      .filter(Boolean)
      .join('');

    const payload = {
      title: title.trim(),
      author: author.trim(),
      category,
      imageUrl: imageUrl.trim(),
      readTime: readTime.trim(),
      tags: tags.trim(),
      excerpt: excerpt.trim(),
      content: paragraphs,
      isFeatured,
      isBreaking,
      status,
    };

    try {
      const apiUrl = view === 'edit' ? `/api/articles/${currentArticleId}` : '/api/articles';
      const method = view === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccessMsg(view === 'edit' ? 'Article modifié avec succès.' : 'Article publié avec succès.');
        setView('list');
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      setErrorMsg("Erreur réseau lors de la communication avec l'API.");
    } finally {
      setSubmitting(false);
    }
  };

  // Counts for statuses
  const totalCount = articles.length;
  const publishedCount = articles.filter(a => !a.status || a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const pendingCount = articles.filter(a => a.status === 'pending').length;
  const trashCount = articles.filter(a => a.status === 'trash').length;

  // Filter articles
  const filteredArticles = articles.filter(article => {
    // Search filter
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'published') {
      matchesStatus = !article.status || article.status === 'published';
    } else if (statusFilter === 'draft') {
      matchesStatus = article.status === 'draft';
    } else if (statusFilter === 'pending') {
      matchesStatus = article.status === 'pending';
    } else if (statusFilter === 'trash') {
      matchesStatus = article.status === 'trash';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Administration */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-black text-xl md:text-2xl font-display text-white">Console de Rédaction</h2>
          <p className="text-slate-400 text-xs font-semibold">Gérez et éditez toutes les actualités et dossiers de Faso Diaspora.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 text-emerald-650 dark:text-emerald-450 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="hover:opacity-75">×</button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-650 dark:text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="hover:opacity-75">×</button>
        </div>
      )}

      {/* -------------------- 1. VIEW LIST -------------------- */}
      {view === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status tabs (Wordpress Style) */}
            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-400">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`pb-1 border-b-2 hover:text-slate-850 dark:hover:text-white transition-all ${statusFilter === 'all' ? 'border-burkina-red text-slate-800 dark:text-white' : 'border-transparent'}`}
              >
                Tous ({totalCount})
              </button>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <button 
                onClick={() => setStatusFilter('published')}
                className={`pb-1 border-b-2 hover:text-slate-850 dark:hover:text-white transition-all ${statusFilter === 'published' ? 'border-burkina-red text-slate-800 dark:text-white' : 'border-transparent'}`}
              >
                Publiés ({publishedCount})
              </button>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <button 
                onClick={() => setStatusFilter('draft')}
                className={`pb-1 border-b-2 hover:text-slate-850 dark:hover:text-white transition-all ${statusFilter === 'draft' ? 'border-burkina-red text-slate-800 dark:text-white' : 'border-transparent'}`}
              >
                Brouillons ({draftCount})
              </button>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <button 
                onClick={() => setStatusFilter('pending')}
                className={`pb-1 border-b-2 hover:text-slate-850 dark:hover:text-white transition-all ${statusFilter === 'pending' ? 'border-burkina-red text-slate-800 dark:text-white' : 'border-transparent'}`}
              >
                En attente ({pendingCount})
              </button>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <button 
                onClick={() => setStatusFilter('trash')}
                className={`pb-1 border-b-2 hover:text-slate-850 dark:hover:text-white transition-all ${statusFilter === 'trash' ? 'border-burkina-red text-slate-800 dark:text-white' : 'border-transparent'}`}
              >
                Corbeille ({trashCount})
              </button>
            </div>

            <button 
              onClick={triggerCreateView}
              className="flex items-center gap-1 bg-burkina-red hover:bg-red-750 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Ajouter un article
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher par titre, auteur..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-burkina-red rounded-xl py-2.5 pl-9 pr-4 text-xs md:text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-burkina-red rounded-xl py-2.5 px-4 text-xs md:text-sm"
              >
                <option value="all">Toutes les catégories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end text-[11px] text-slate-400 font-bold pr-2">
              Affichage de {filteredArticles.length} / {articles.length} articles
            </div>
          </div>

          {/* Articles Table list */}
          {loadingList ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-burkina-red animate-spin" />
              <span className="text-slate-400 text-xs font-semibold">Chargement de la base d'articles...</span>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 italic text-sm">
              Aucun article ne correspond à votre recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="pb-3 w-16">Couverture</th>
                    <th className="pb-3 pl-4">Titre</th>
                    <th className="pb-3 w-28">Auteur</th>
                    <th className="pb-3 w-24">Catégorie</th>
                    <th className="pb-3 w-28">Statut</th>
                    <th className="pb-3 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredArticles.map((art) => {
                    const matchedCat = CATEGORIES.find(c => c.slug === art.category);
                    
                    // Status Badge color mapping
                    const statusLabels: Record<string, string> = {
                      published: 'Publié',
                      draft: 'Brouillon',
                      pending: 'En attente',
                      trash: 'Corbeille'
                    };
                    const statusColors: Record<string, string> = {
                      published: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200',
                      draft: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700',
                      pending: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-200',
                      trash: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200'
                    };

                    return (
                      <tr key={art.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                        <td className="py-3.5">
                          <img 
                            src={art.image_url} 
                            alt={art.title} 
                            className="w-12 h-9 object-cover rounded-lg shadow-sm bg-slate-100" 
                          />
                        </td>
                        <td className="py-3.5 pl-4 max-w-sm">
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Créé le {new Date(art.created_at || Date.now()).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-slate-500 font-semibold">{art.author}</td>
                        <td className="py-3.5">
                          <span className="text-[10px] font-bold text-burkina-red bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded">
                            {matchedCat?.name || art.category}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[art.status || 'published']}`}>
                            {statusLabels[art.status || 'published']}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {art.status !== 'trash' && (
                              <Link 
                                href={`/articles/${art.slug}`}
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors"
                                title="Visualiser l'article sur le site"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                            <button 
                              onClick={() => triggerEditView(art)}
                              className="p-2 text-slate-400 hover:text-burkina-green transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="p-2 text-slate-400 hover:text-burkina-red transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* -------------------- 2. CREATE / EDIT FORM VIEW -------------------- */}
      {(view === 'create' || view === 'edit') && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setView('list')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-extrabold text-base md:text-lg text-slate-850 dark:text-white flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-burkina-red" />
                {view === 'edit' ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </h3>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 bg-burkina-red hover:bg-red-750 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {view === 'edit' ? 'Enregistrer' : 'Publier'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="article-title-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Titre de l'article *</label>
              <input
                type="text"
                id="article-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="ex: Coopération Burkina-Qasar : Des accords bilatéraux conclus..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="article-author-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Auteur de l'article *</label>
              <input
                type="text"
                id="article-author-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="article-category-select" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Catégorie *</label>
              <select
                id="article-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Statut (Draft, Pending, Published, Trash) */}
            <div>
              <label htmlFor="article-status-select" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Statut de publication *</label>
              <select
                id="article-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white font-bold"
              >
                <option value="published">Publié (En ligne)</option>
                <option value="draft">Brouillon (Interne)</option>
                <option value="pending">En attente de relecture</option>
                <option value="trash">Corbeille</option>
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label htmlFor="article-readtime-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Temps de lecture estimé</label>
              <input
                type="text"
                id="article-readtime-input"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
              />
            </div>

            {/* Image URL Cover Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Image de couverture *</label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* File Upload button */}
                <div className="relative flex-shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-file-upload"
                    onChange={handleCoverUploadChange}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                  <label
                    htmlFor="cover-file-upload"
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-250 dark:border-slate-700"
                  >
                    {uploadingCover ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                    )}
                    Uploader l'image
                  </label>
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    placeholder="URL de l'image de couverture"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSuggestImage}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-355 p-3 rounded-xl transition-all border border-slate-250 dark:border-slate-700"
                    title="Suggérer une image basée sur la catégorie"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Vous pouvez charger un fichier local pour l'héberger ou saisir une URL externe.</p>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label htmlFor="article-tags-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Tags (séparés par des virgules)</label>
              <input
                type="text"
                id="article-tags-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 md:col-span-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-burkina-red rounded border-slate-350 focus:ring-burkina-red"
                />
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">Mettre à la Une (Carrousel de tête)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 text-burkina-red rounded border-slate-350 focus:ring-burkina-red"
                />
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">Dernière minute (Défilement continu)</span>
              </label>
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label htmlFor="article-excerpt-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Résumé / Introduction *</label>
              <textarea
                id="article-excerpt-input"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white resize-none"
                placeholder="Courte description d'accroche pour la carte d'article"
              />
            </div>

            {/* Content (Rich markdown body + image insertions) */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="article-content-input" className="block text-xs font-bold text-slate-400 uppercase">Corps de l'article *</label>
                
                {/* Insert Image in Body Trigger */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="body-file-upload"
                    onChange={handleBodyUploadChange}
                    className="hidden"
                    disabled={uploadingBody}
                  />
                  <label
                    htmlFor="body-file-upload"
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all border border-slate-250 dark:border-slate-700 uppercase tracking-wider"
                  >
                    {uploadingBody ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    Insérer une image dans le corps
                  </label>
                </div>
              </div>
              <textarea
                id="article-content-input"
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white font-mono leading-relaxed"
                placeholder="Rédigez le texte de l'article en tapant deux retours à la ligne pour séparer les paragraphes."
              />
              <p className="text-[10px] text-slate-400">Astuce : Séparez vos paragraphes par un double retour à la ligne pour former des paragraphes propres sur le site.</p>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}
