/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import { CacheFirst, ExpirationPlugin } from 'serwist';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.searchParams.has('_rsc'),
      handler: new CacheFirst({
        cacheName: 'next-data-v1',
        plugins: [
          // Чтобы кэш не раздувался, храним данные 7 дней
          new ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 дней в секундах
            maxEntries: 100, // ограничение по количеству файлов
          }),
          {
            cacheWillUpdate: async ({ response }) => {
              if (response && response.status === 200) {
                return response;
              }

              return null; // Ошибки (404, 500) игнорируем и не кэшируем
            },
          },
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
