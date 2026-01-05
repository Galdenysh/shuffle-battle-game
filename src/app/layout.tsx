import './globals.css';

import React from 'react';
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
  appleWebApp: {
    capable: true,
    title: 'Shuffle Battle',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
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
