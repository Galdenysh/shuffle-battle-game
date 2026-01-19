import { siteConfig } from '@/lib/constants';
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: 'ru',
    id: siteConfig.id,
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    categories: ['games', 'entertainment'],
    display: 'standalone',
    display_override: ['fullscreen', 'standalone'],
    orientation: 'portrait',
    start_url: '/',
    scope: '/',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
