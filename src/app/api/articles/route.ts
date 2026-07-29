import { NextRequest, NextResponse } from 'next/server';
import { fetchArticles, fetchAllArticlesForAdmin, insertArticle } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get('all') === 'true';
    const articles = all 
      ? await fetchAllArticlesForAdmin() 
      : await fetchArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('API Error fetching articles:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des articles' }, { status: 500 });
  }
}

// Simple helper to slugify text
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, imageUrl, author, tags, isFeatured, isBreaking, readTime, status } = body;

    if (!title || !excerpt || !content || !category || !imageUrl || !author) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    const newArticle = await insertArticle({
      title,
      slug,
      excerpt,
      content,
      category,
      image_url: imageUrl,
      author,
      read_time: readTime || '4 min',
      is_featured: !!isFeatured,
      is_breaking: !!isBreaking,
      tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      status: status || 'published'
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('API Error adding article:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 550 });
  }
}
