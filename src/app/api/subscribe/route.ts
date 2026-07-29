import { NextRequest, NextResponse } from 'next/server';
import { insertSubscriber } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }
    
    const success = await insertSubscriber(email.trim().toLowerCase());
    if (!success) {
      return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error subscribing:', error);
    return NextResponse.json({ error: error.message || 'Erreur interne de serveur' }, { status: 500 });
  }
}
