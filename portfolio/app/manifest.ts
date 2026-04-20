import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Techu Mayur Portfolio',
    short_name: 'Techu Mayur',
    description: 'Portfolio and engineering blog of Techu Mayur, Frontend Developer & Content Creator.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B666A',
    theme_color: '#0B666A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
