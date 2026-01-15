import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { GameLayoutClient } from './components';

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function GameLayout({ children }: { children: ReactNode }) {
  return <GameLayoutClient>{children}</GameLayoutClient>;
}
