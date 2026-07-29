'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, AlertTriangle, ArrowLeft, Landmark } from 'lucide-react';
import { supabaseMock } from '@/lib/supabase-client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabaseMock.auth.signInWithPassword({
        email,
        password
      }) as any;

      if (authError) {
        setError(authError.message);
      } else if (!data?.session && password !== 'diaspora2026') {
        // Fallback validation for local mock mode
        setError('Mot de passe incorrect (indice: diaspora2026)');
      } else {
        // Retrieve the real access_token from Supabase session if available
        const token = data?.session?.access_token || 'admin-logged-in-token';
        document.cookie = `diaspora-session=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-slate-500 hover:text-burkina-red transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour au journal
        </Link>
      </div>

      <div className="max-w-md w-full bg-card border border-slate-200 dark:border-slate-850 p-8 rounded-3xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-burkina-red to-burkina-green rounded-xl shadow-md">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-extrabold text-xl md:text-2xl font-display text-slate-900 dark:text-white mt-4">
            Espace Rédaction
          </h1>
          <p className="text-slate-400 text-xs">
            Connexion réservée aux journalistes et éditeurs de Faso Diaspora
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-650 dark:text-red-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Adresse email</label>
            <div className="relative">
              <input
                type="email"
                id="email-input"
                placeholder="redacteur@fasodiaspora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-slate-800 dark:text-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Utilisez n'importe quelle adresse finissant par @fasodiaspora.com</p>
          </div>

          <div>
            <label htmlFor="pwd-input" className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Mot de passe</label>
            <div className="relative">
              <input
                type="password"
                id="pwd-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-burkina-red focus:outline-none rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-slate-800 dark:text-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Le mot de passe de test est: <strong className="text-slate-600 dark:text-slate-200">diaspora2026</strong></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-burkina-red dark:hover:bg-burkina-red text-white py-3 rounded-xl font-bold text-xs md:text-sm transition-all shadow-md disabled:opacity-50"
            id="login-btn"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
