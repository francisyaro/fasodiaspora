'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Vérifier si le navigateur supporte les Service Workers et qu'on est côté client
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker enregistré avec succès, scope :', registration.scope);
        } catch (error) {
          console.error('Échec de l\'enregistrement du Service Worker :', error);
        }
      };

      // Attendre que la page soit entièrement chargée
      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}
