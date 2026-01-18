import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { GameLayoutClient } from './components';

export const metadata: Metadata = {
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function GameLayout({ children }: { children: ReactNode }) {
  return <GameLayoutClient>{children}</GameLayoutClient>;
}
