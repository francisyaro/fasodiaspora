-- 1. Table des Articles
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  author TEXT,
  read_time TEXT,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}'
);

-- 2. Table des Vidéos (Faso Diaspora TV)
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  duration TEXT,
  views_count TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

-- 3. Table des Commentaires
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT REFERENCES articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les performances de requêtes et de jointures
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);

-- Fonction pour incrémenter le compteur de vues d'un article
CREATE OR REPLACE FUNCTION increment_views(article_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql;
