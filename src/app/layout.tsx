import './globals.css';

import React from 'react';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

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
          jetbrainsMono.className,
          'fixed inset-0 size-full touch-none'
        )}
      >
        {children}
      </body>
    </html>
  );
}
