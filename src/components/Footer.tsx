'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Landmark } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-[#000000] text-slate-400 font-sans text-xs">
      
      {/* 1. Newsletter Banner (Black/Dark Gray) */}
      <div className="w-full bg-[#111111] border-y border-neutral-850 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Restez informé en temps réel</h4>
              <p className="text-slate-500 text-xs">Abonnez-vous à notre newsletter quotidienne.</p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:max-w-md items-center bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-transparent text-xs text-white pl-4 pr-3 py-2.5 focus:outline-none placeholder-slate-600"
              id="newsletter-footer-input"
            />
            <button 
              type="submit" 
              className="bg-burkina-red hover:bg-red-750 text-white font-extrabold px-6 py-2.5 text-xs uppercase transition-colors"
            >
              S'ABONNER
            </button>
          </form>
        </div>
        {subscribed && (
          <div className="max-w-7xl mx-auto px-4 pt-2 text-center text-emerald-450 text-[11px] font-bold animate-pulse">
            Inscription validée ! Merci pour votre confiance.
          </div>
        )}
      </div>

      {/* 2. Main Footer Blocks */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex flex-col items-start select-none">
            <div className="font-black text-xl tracking-tight leading-none font-display">
              <span className="text-white">FASO</span>
              <span className="text-burkina-red">DIASPORA</span>
            </div>
            <span className="text-[7.5px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
              L'info du Faso pour la diaspora et de la diaspora pour le faso
            </span>
          </Link>
          <p className="text-slate-500 text-xs leading-relaxed">
            Votre portail d'actualité de référence pour suivre en continu le développement socio-économique et culturel du Burkina Faso.
          </p>
          {/* Social Icons (White/Slate-400) */}
          <div className="flex gap-3.5 pt-2">
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: LIENS RAPIDES */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white border-l-3 border-burkina-red pl-2.5">
            LIENS RAPIDES
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
          </ul>
        </div>

        {/* Col 3: RUBRIQUES */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white border-l-3 border-burkina-red pl-2.5">
            RUBRIQUES
          </h3>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li><a href="#" className="hover:text-white transition-colors">Dossiers</a></li>
          </ul>
        </div>

        {/* Col 4: CONTACT */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white border-l-3 border-burkina-red pl-2.5">
            CONTACT
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-500">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>01 BP 1234 Ouagadougou 01, Burkina Faso</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>+226 70 13 54 56</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>contact@fasoweb.bf</span>
            </li>
          </ul>
        </div>

        {/* Col 5: APPLICATION MOBILE */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white border-l-3 border-burkina-red pl-2.5">
            APPLICATION MOBILE
          </h3>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded border border-neutral-800 flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M17.523 15.3l-2.03-1.21c-.2-.12-.45-.1-.63.06l-1.37 1.22c-2.43-1.12-4.08-2.76-5.2-5.2l1.22-1.37c.16-.18.18-.43.06-.63l-1.21-2.03c-.15-.25-.46-.35-.72-.21l-2 .99c-.22.11-.37.33-.37.58 0 6.64 5.39 12.03 12.03 12.03.25 0 .47-.15.58-.37l.99-2c.14-.26.04-.57-.21-.72z"/>
              </svg>
              <div className="text-[8px] text-left leading-none text-slate-450">
                <div className="text-[7px]">Disponible sur</div>
                <strong className="text-white text-[9px] font-black">Google Play</strong>
              </div>
            </a>
            <a href="#" className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded border border-neutral-800 flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82z"/>
              </svg>
              <div className="text-[8px] text-left leading-none text-slate-450">
                <div className="text-[7px]">Télécharger sur</div>
                <strong className="text-white text-[9px] font-black">App Store</strong>
              </div>
            </a>
          </div>
        </div>

      </div>

      {/* 3. Bottom Red Copyright Bar */}
      <div className="w-full bg-burkina-red text-white py-5 font-semibold text-[10px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} FASODIASPORA - Tous droits réservés
          </div>
          <div className="flex items-center gap-1.5">
            Fait avec ❤️ pour le Faso et sa diaspora
          </div>
        </div>
      </div>

    </footer>
  );
}
