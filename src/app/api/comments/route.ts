import { NextResponse } from 'next/server';
import { insertComment } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, authorName, content } = body;

    if (!articleId || !authorName || !content) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const newComment = await insertComment(articleId, authorName, content);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('API Error adding comment:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 550 });
  }
}
