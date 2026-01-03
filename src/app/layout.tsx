import './globals.css';

import React from 'react';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

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
          inter.className,
          'fixed top-0 left-0 size-full touch-none'
        )}
      >
        {children}
      </body>
    </html>
  );
}
