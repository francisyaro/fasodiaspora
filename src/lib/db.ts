import fs from 'fs';
import path from 'path';
import { Article, Comment, Category, Video } from './types';

import { CATEGORIES } from './categories';


const dbFilePath = path.join(process.cwd(), 'src/lib/db.json');

interface DbSchema {
  articles: Article[];
  comments: Comment[];
  videos: Video[];
}

// In-memory fallback if file system is unavailable
let inMemoryDb: DbSchema = {
  articles: [],
  comments: [],
  videos: [],
};

// Load initial data
function loadDb(): DbSchema {
  try {
    if (fs.existsSync(dbFilePath)) {
      const data = fs.readFileSync(dbFilePath, 'utf8');
      const parsed = JSON.parse(data);
      // Ensure videos array exists in parsed db
      if (!parsed.videos) parsed.videos = [];
      // Synchronize in-memory cache
      inMemoryDb = parsed;
      return parsed;
    }
  } catch (error) {
    console.error('Failed to read db.json, using in-memory database:', error);
  }
  return inMemoryDb;
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    inMemoryDb = data;
  } catch (error) {
    console.error('Failed to write to db.json, updating in-memory only:', error);
    inMemoryDb = data;
  }
}

// Ensure database is populated at startup
loadDb();

export async function getArticles(): Promise<Article[]> {
  const db = loadDb();
  const publishedArticles = db.articles.filter(a => !a.status || a.status === 'published');
  // Sort by date (descending)
  return [...publishedArticles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = loadDb();
  const article = db.articles.find(a => a.slug === slug);
  return article || null;
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(a => a.category === categorySlug);
}

export async function getBreakingNews(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(a => a.is_breaking);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(a => a.is_featured);
}

export async function getRecentArticles(limit = 5): Promise<Article[]> {
  const articles = await getArticles();
  return articles.slice(0, limit);
}

export async function incrementViews(slug: string): Promise<void> {
  const db = loadDb();
  const article = db.articles.find(a => a.slug === slug);
  if (article) {
    article.views_count += 1;
    saveDb(db);
  }
}

export async function getComments(articleId: string): Promise<Comment[]> {
  const db = loadDb();
  return db.comments
    .filter(c => c.article_id === articleId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addComment(articleId: string, authorName: string, content: string): Promise<Comment> {
  const db = loadDb();
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    article_id: articleId,
    author_name: authorName,
    content,
    created_at: new Date().toISOString(),
  };

  db.comments.push(newComment);

  // Update comments count on article
  const article = db.articles.find(a => a.id === articleId);
  if (article) {
    article.comments_count += 1;
  }

  saveDb(db);
  return newComment;
}

export async function createArticle(articleData: Omit<Article, 'id' | 'views_count' | 'comments_count' | 'created_at'>): Promise<Article> {
  const db = loadDb();
  const newArticle: Article = {
    ...articleData,
    id: `art-${Date.now()}`,
    views_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
  };

  db.articles.push(newArticle);
  saveDb(db);
  return newArticle;
}

export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getArticles();
  if (!query) return articles;
  
  const lowerQuery = query.toLowerCase();
  return articles.filter(a => 
    a.title.toLowerCase().includes(lowerQuery) || 
    a.excerpt.toLowerCase().includes(lowerQuery) || 
    a.content.toLowerCase().includes(lowerQuery) ||
    a.tags?.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export async function getVideos(): Promise<Video[]> {
  const db = loadDb();
  return db.videos || [];
}

export async function getFeaturedVideo(): Promise<Video | null> {
  const videos = await getVideos();
  return videos.find(v => v.is_featured) || null;
}

export async function getRecentVideos(limit = 4): Promise<Video[]> {
  const videos = await getVideos();
  return videos.filter(v => !v.is_featured).slice(0, limit);
}

export async function getArticlesAdmin(): Promise<Article[]> {
  const db = loadDb();
  return [...db.articles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function updateArticle(id: string, updatedData: Partial<Article>): Promise<Article | null> {
  const db = loadDb();
  const index = db.articles.findIndex(a => a.id === id);
  if (index === -1) return null;

  db.articles[index] = {
    ...db.articles[index],
    ...updatedData,
  };
  saveDb(db);
  return db.articles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = loadDb();
  const initialLength = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== id);
  
  if (db.articles.length < initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

