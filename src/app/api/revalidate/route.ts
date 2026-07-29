import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = request.nextUrl.searchParams.get('secret');

    // Vérification du jeton de sécurité
    const token = process.env.REVALIDATION_TOKEN || 'diaspora-reval-token-2026';
    if (secret !== token) {
      return NextResponse.json({ message: 'Token de revalidation invalide' }, { status: 401 });
    }

    // Régénérer les pages principales
    revalidatePath('/');
    revalidatePath('/sitemap.xml');
    
    // Régénérer les catégories
    revalidatePath('/categories/[category]', 'page');

    // Régénérer la page d'un article spécifique si son slug est fourni
    // Payload du webhook Supabase : record = nouvelle ligne, old_record = ancienne ligne
    const slug = body?.record?.slug || body?.old_record?.slug;
    if (slug) {
      revalidatePath(`/articles/${slug}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
