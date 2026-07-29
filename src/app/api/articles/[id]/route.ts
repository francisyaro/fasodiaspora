import { NextRequest, NextResponse } from 'next/server';
import { updateArticle, deleteArticle } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Map camelCase frontend fields to snake_case database schema
    const mappedData: any = {};
    if (body.title !== undefined) mappedData.title = body.title;
    if (body.excerpt !== undefined) mappedData.excerpt = body.excerpt;
    if (body.content !== undefined) mappedData.content = body.content;
    if (body.category !== undefined) mappedData.category = body.category;
    if (body.imageUrl !== undefined) mappedData.image_url = body.imageUrl;
    if (body.author !== undefined) mappedData.author = body.author;
    if (body.readTime !== undefined) mappedData.read_time = body.readTime;
    if (body.isFeatured !== undefined) mappedData.is_featured = !!body.isFeatured;
    if (body.isBreaking !== undefined) mappedData.is_breaking = !!body.isBreaking;
    if (body.status !== undefined) mappedData.status = body.status;
    if (body.tags !== undefined) {
      mappedData.tags = typeof body.tags === 'string'
        ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : body.tags;
    }

    const updated = await updateArticle(id, mappedData);
    if (!updated) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API Error updating article:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteArticle(id);
    if (!success) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error deleting article:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la suppression' }, { status: 500 });
  }
}
