'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, User, Landmark, Mail } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Modal subscription states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => {
          setSubscribed(false);
          setIsModalOpen(false);
        }, 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setErrorMsg("Impossible de joindre le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-[#0c0c0c] text-white relative z-30 font-sans">
      
      {/* 1. Main Black Header: Hamburger, Logo, Socials & Subscribe */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
            aria-label="Menu principal"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <Link href="/" className="flex flex-col items-start select-none">
            <div className="font-extrabold text-2xl md:text-3xl tracking-tight leading-none font-display">
              <span className="text-white">FASO</span>
              <span className="text-burkina-red">DIASPORA</span>
            </div>
            <span className="text-[8.5px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              L'info du Faso pour la diaspora et de la diaspora pour le faso
            </span>
          </Link>
        </div>

        {/* Right: Social Icons + Subscribe Button */}
        <div className="flex items-center gap-6">
          
          {/* Socials */}
          <div className="hidden md:flex items-center gap-3.5">
            <a href="#" className="text-slate-450 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-450 hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-450 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="text-slate-450 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          {/* S'abonner Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-burkina-red hover:bg-red-700 text-white font-extrabold text-[11px] md:text-xs py-2.5 px-5 rounded tracking-wider transition-colors uppercase"
          >
            S'ABONNER
          </button>
        </div>

      </div>

      {/* 2. Red Navbar */}
      <nav className="w-full bg-[#C20000] text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center min-h-[44px]">
          
          {/* Menu links */}
          <div className="hidden lg:flex items-center">
            <Link 
              href="/" 
              className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider transition-colors ${
                pathname === '/' ? 'bg-[#980000] text-white' : 'hover:bg-[#a50000]'
              }`}
            >
              Accueil
            </Link>
            
            {CATEGORIES.slice(0, 6).map((cat) => {
              const catPath = `/categories/${cat.slug}`;
              const isActive = pathname === catPath;
              return (
                <Link
                  key={cat.id}
                  href={catPath}
                  className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider transition-colors ${
                    isActive ? 'bg-[#980000] text-white' : 'hover:bg-[#a50000]'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
            
            {/* Hardcoded category links matching mockup */}
            <Link href="#" className="py-3.5 px-4 text-xs font-black uppercase tracking-wider hover:bg-[#a50000] transition-colors">
              International
            </Link>
            <Link href="/categories/diaspora" className="py-3.5 px-4 text-xs font-black uppercase tracking-wider hover:bg-[#a50000] transition-colors">
              Diaspora
            </Link>
            <Link href="/categories/sport" className="py-3.5 px-4 text-xs font-black uppercase tracking-wider hover:bg-[#a50000] transition-colors">
              Sport
            </Link>
            <Link href="#" className="py-3.5 px-4 text-xs font-black uppercase tracking-wider hover:bg-[#a50000] transition-colors">
              Dossiers
            </Link>
          </div>

          {/* Search Trigger Icon */}
          <div className="flex items-center gap-2 ml-auto">
            {searchOpen && (
              <form onSubmit={handleSearchSubmit} className="animate-in slide-in-from-right-2 duration-150 relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#980000] text-white text-xs pl-3 pr-8 py-1 rounded border border-transparent focus:outline-none focus:border-white w-40 md:w-56"
                  id="navbar-search-input"
                />
                <button type="submit" className="absolute right-2.5 top-1.5 text-white/70 hover:text-white" aria-label="Lancer la recherche">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-[#a50000] rounded transition-colors"
              aria-label="Recherche"
              id="search-toggle-btn"
            >
              <Search className="w-4.5 h-4.5 text-white" />
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0c0c] border-t border-neutral-850 py-3.5 animate-in slide-in-from-top-4 duration-200">
            <div className="px-4 space-y-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded text-sm font-bold ${
                  pathname === '/' ? 'bg-[#C20000] text-white' : 'text-slate-300 hover:bg-neutral-800'
                }`}
              >
                Accueil
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2.5 px-3 rounded text-sm font-bold ${
                    pathname === `/categories/${cat.slug}` ? 'bg-[#C20000] text-white' : 'text-slate-300 hover:bg-neutral-800'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-neutral-800 my-2 pt-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded text-sm font-bold text-slate-400 hover:bg-neutral-800"
                >
                  Espace Rédaction (Admin)
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 3. News Ticker strip */}
      <div className="w-full bg-[#141414] py-2 px-4 border-b border-neutral-850 text-xs font-semibold text-slate-400 flex items-center gap-3">
        <div className="bg-burkina-red text-white py-1 px-2.5 font-extrabold uppercase text-[9px] tracking-wider flex-shrink-0">
          EN CE MOMENT
        </div>
        <BreakingNewsTicker />
      </div>

      {/* Subscription Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-burkina-red rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-850 dark:text-white font-display">Abonnez-vous à la Newsletter</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Rejoignez la communauté de Faso Diaspora et recevez chaque jour notre condensé d'actualités directes et de grands dossiers.
              </p>
            </div>

            {subscribed ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 text-emerald-600 dark:text-emerald-450 p-4 rounded-2xl text-xs font-bold text-center animate-pulse">
                🎉 Inscription validée ! Merci pour votre fidélité.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label htmlFor="modal-subscribe-email" className="block text-[10px] font-bold text-slate-400 uppercase">Adresse e-mail</label>
                  <input
                    type="email"
                    id="modal-subscribe-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    placeholder="nom@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-burkina-red focus:outline-none rounded-xl py-3 px-4 text-xs md:text-sm text-slate-850 dark:text-white disabled:opacity-50"
                  />
                </div>

                {errorMsg && (
                  <p className="text-rose-500 text-[10px] font-bold text-left">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-burkina-red hover:bg-red-750 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Inscription...' : "S'abonner maintenant"}
                </button>
              </form>
            )}

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
              Vous pouvez vous désabonner à tout moment. Aucune donnée n'est partagée.
            </p>
          </div>
        </div>
      )}

    </header>
  );
}
