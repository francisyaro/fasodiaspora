export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  author_avatar?: string;
  read_time: string;
  comments_count: number;
  views_count: number;
  created_at: string;
  is_featured: boolean;
  is_breaking: boolean;
  tags?: string[];
  status?: 'draft' | 'pending' | 'published' | 'trash';
}

export interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string; // Tailwind class for border/bg/text
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  duration: string;
  views_count: string;
  created_at: string;
  category: string;
  is_featured: boolean;
}

