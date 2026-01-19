import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { OrientationLock, PreventZoom, VKProvider } from '@/components';
import { SerwistProvider } from './serwist';
import { siteConfig } from '@/lib/constants';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  appleWebApp: {
    title: siteConfig.title,
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
  viewportFit: 'contain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full bg-black overflow-hidden">
      <body
        className={cn(
          jetbrainsMono.variable,
          'font-mono antialiased',
          'h-full m-0 p-0 bg-black overflow-hidden'
        )}
      >
        <SerwistProvider swUrl="/sw.js">
          <PreventZoom />
          <OrientationLock />
          <VKProvider />
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}
