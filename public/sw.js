const CACHE_NAME = 'faso-diaspora-v1';

// Fichiers de base à mettre en cache immédiatement à l'installation
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
];

// Installation du Service Worker et mise en cache des ressources critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes HTTP (Stratégie Stale-While-Revalidate + Hors-ligne)
self.addEventListener('fetch', (event) => {
  // Ne gérer que les requêtes GET publiques
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Filtrer pour n'intercepter que notre origine locale et les images Unsplash (CDN)
  const isLocalRequest = url.startsWith(self.location.origin);
  const isUnsplashRequest = url.startsWith('https://images.unsplash.com');
  
  if (!isLocalRequest && !isUnsplashRequest) {
    return;
  }

  // Ignorer les requêtes d'API internes et de développement (WebSockets, Next.js hot reload)
  if (url.includes('/_next/webpack') || url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si la ressource est déjà en cache, on la sert immédiatement (chargement instantané)
      // tout en lançant un appel réseau en tâche de fond pour mettre à jour le cache (Stale-While-Revalidate)
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {}); // Échec silencieux du réseau en arrière-plan
        
        return cachedResponse;
      }

      // Si la ressource n'est pas en cache, on la récupère sur le réseau
      return fetch(event.request)
        .then((networkResponse) => {
          // Ne mettre en cache que les requêtes valides (statut 200)
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Repli hors-ligne en cas d'absence totale de réseau
          // Si l'utilisateur navigue vers une page HTML, on renvoie la racine '/' du site qui a été pré-cachée
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return null;
        });
    })
  );
});
