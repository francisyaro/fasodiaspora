import { createClient } from '@supabase/supabase-js';
import * as db from './db';
import { Article, Comment, Video } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Instance réelle du client Supabase
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Mock d'authentification pour conserver la compatibilité locale et cloud
export const supabaseMock = {
  auth: {
    getSession: async () => {
      if (supabase) {
        return supabase.auth.getSession();
      }
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string, password?: string }) => {
      if (supabase) {
        return supabase.auth.signInWithPassword({ email, password: password || '' });
      }
      // Simulation locale par défaut
      if (email.endsWith('@fasodiaspora.com')) {
        return { data: { user: { email, id: 'admin-user-id' } }, error: null };
      }
      return { data: { user: null }, error: { message: 'Identifiants invalides' } };
    },
    signOut: async () => {
      if (supabase) {
        return supabase.auth.signOut();
      }
      return { error: null };
    },
  }
};

/**
 * Couche d'accès aux données. Bascule automatiquement entre le Cloud Supabase 
 * et la base locale db.json selon la présence des clés dans le fichier .env.local.
 */

export async function fetchArticles(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erreur Supabase articles :', error.message);
      return db.getArticles(); // fallback local
    }
    return data as Article[];
  }
  return db.getArticles();
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) {
      console.error(`Erreur Supabase article ${slug} :`, error.message);
      return db.getArticleBySlug(slug);
    }
    return data as Article | null;
  }
  return db.getArticleBySlug(slug);
}

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(`Erreur Supabase catégorie ${category} :`, error.message);
      return db.getArticlesByCategory(category);
    }
    return data as Article[];
  }
  return db.getArticlesByCategory(category);
}

export async function fetchBreakingNews(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_breaking', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) return db.getBreakingNews();
    return data as Article[];
  }
  return db.getBreakingNews();
}

export async function fetchFeaturedArticles(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) return db.getFeaturedArticles();
    return data as Article[];
  }
  return db.getFeaturedArticles();
}

export async function fetchRecentArticles(limit = 5): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return db.getRecentArticles(limit);
    return data as Article[];
  }
  return db.getRecentArticles(limit);
}

export async function incrementArticleViews(slug: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.rpc('increment_views', { article_slug: slug });
    if (error) {
      console.error('Erreur Supabase incrément vues :', error.message);
      return db.incrementViews(slug);
    }
    return;
  }
  return db.incrementViews(slug);
}

export async function fetchComments(articleId: string): Promise<Comment[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });
    if (error) return db.getComments(articleId);
    return data as Comment[];
  }
  return db.getComments(articleId);
}

export async function insertComment(articleId: string, authorName: string, content: string): Promise<Comment> {
  if (supabase) {
    const newId = `com-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase
      .from('comments')
      .insert([{ id: newId, article_id: articleId, author_name: authorName, content }])
      .select()
      .single();
    if (error) {
      console.error('Erreur Supabase insertion commentaire :', error.message);
      return db.addComment(articleId, authorName, content);
    }
    return data as Comment;
  }
  return db.addComment(articleId, authorName, content);
}

export async function insertArticle(articleData: Omit<Article, 'id' | 'views_count' | 'comments_count' | 'created_at'>): Promise<Article> {
  if (supabase) {
    const newId = `art-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        id: newId,
        ...articleData,
        views_count: 0,
        comments_count: 0
      }])
      .select()
      .single();
    if (error) {
      console.error('Erreur Supabase insertion article :', error.message);
      return db.createArticle(articleData);
    }
    return data as Article;
  }
  return db.createArticle(articleData);
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) return db.searchArticles(query);
    return data as Article[];
  }
  return db.searchArticles(query);
}

export async function fetchVideos(): Promise<Video[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('id', { ascending: true });
    if (error) return db.getVideos();
    return data as Video[];
  }
  return db.getVideos();
}

export async function fetchFeaturedVideo(): Promise<Video | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_featured', true)
      .maybeSingle();
    if (error) return db.getFeaturedVideo();
    return data as Video | null;
  }
  return db.getFeaturedVideo();
}

export async function fetchRecentVideos(limit = 4): Promise<Video[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('id', { ascending: true })
      .limit(limit);
    if (error) return db.getRecentVideos(limit);
    return data as Video[];
  }
  return db.getRecentVideos(limit);
}

export async function fetchAllArticlesForAdmin(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erreur Supabase fetchAllArticlesForAdmin :', error.message);
      return db.getArticlesAdmin();
    }
    return data as Article[];
  }
  return db.getArticlesAdmin();
}

export async function updateArticle(id: string, updatedData: Partial<Article>): Promise<Article | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Erreur Supabase updateArticle ${id} :`, error.message);
      return db.updateArticle(id, updatedData);
    }
    return data as Article;
  }
  return db.updateArticle(id, updatedData);
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Erreur Supabase deleteArticle ${id} :`, error.message);
      return db.deleteArticle(id);
    }
    return true;
  }
  return db.deleteArticle(id);
}

export async function insertSubscriber(email: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from('subscribers')
      .insert({ email });
    if (error) {
      // Code 23505 is PostgreSQL unique_violation (user already subscribed, which is a success)
      if (error.code === '23505') {
        return true;
      }
      console.warn('Erreur Supabase insertSubscriber, falling back to local database:', error.message);
      return db.insertSubscriber(email);
    }
    return true;
  }
  return db.insertSubscriber(email);
}
