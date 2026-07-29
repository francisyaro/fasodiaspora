import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Faso Diaspora',
    short_name: 'Faso Diaspora',
    description: "Portail d'information de référence de la communauté burkinabè à l'étranger",
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=192&h=192&q=80',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=512&h=512&q=80',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
