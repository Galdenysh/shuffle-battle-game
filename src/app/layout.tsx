import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Shuffle Battle Game',
  description: 'Танцевальный баттл по шаффлу',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Shuffle Battle',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icon-180.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icon-180.png',
      },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={cn(
          jetbrainsMono.variable,
          'font-mono',
          'fixed inset-0 size-full touch-none'
        )}
      >
        {children}
      </body>
    </html>
  );
}
