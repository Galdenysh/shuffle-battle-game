import React from 'react';
import type { ReactNode } from 'react';
import { GameLayoutClient } from './components';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Важно для iPhone
};

export default function GameLayout({ children }: { children: ReactNode }) {
  return <GameLayoutClient>{children}</GameLayoutClient>;
}
