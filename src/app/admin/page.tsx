import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminForm from '@/components/AdminForm';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: "Console Rédaction | Faso Diaspora",
  description: "Espace d'administration pour la gestion des publications.",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('diaspora-session');

  if (!sessionToken) {
    redirect('/admin/login');
  }

  if (supabase) {
    // Vérification réelle du token de session JWT via Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(sessionToken.value);
    if (error || !user) {
      redirect('/admin/login');
    }
  } else {
    // Repli de développement local
    if (sessionToken.value !== 'admin-logged-in-token') {
      redirect('/admin/login');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <AdminForm />
      </main>

      <Footer />
    </div>
  );
}
