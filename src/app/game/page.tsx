'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { RefPhaserGame } from '@/components/PhaserGame';
import { cn } from '@/lib/utils';
import { GameInfo } from './components';
// import { BackgroundBeams } from '@/components/ui';

const GameButtons = dynamic(() => import('./components/GameButtons'), {
  ssr: false,
  loading: () => <div>Загрузка UI...</div>,
});

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <div>Загрузка игры...</div>,
});

export default function GamePage() {
  const phaserRef = useRef<RefPhaserGame | null>(null);

  return (
    <div
      className={cn(
        'relative flex align-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black'
      )}
    >
      <GameInfo />
      <GameButtons />
      <PhaserGame ref={phaserRef} />

      {/* <BackgroundBeams /> */}
    </div>
  );
}
