'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { RefPhaserGame } from '@/components/PhaserGame';
import { cn } from '@/lib/utils';
import { GameInfo } from './components';
import { BackgroundBeams } from '@/components/ui';

const GameButtons = dynamic(() => import('./components/GameButtons'), {
  ssr: false,
  loading: () => <div style={{ zIndex: 10 }}>Загрузка UI...</div>,
});

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <div style={{ zIndex: 10 }}>Загрузка игры...</div>,
});

export default function GamePage() {
  const phaserRef = useRef<RefPhaserGame | null>(null);

  const [buttonsReady, setButtonsReady] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  const handleReadyButtons = useCallback((ready: boolean) => {
    setButtonsReady(ready);
  }, []);

  const handleReadyGame = useCallback((ready: boolean) => {
    setGameReady(ready);
  }, []);

  useEffect(() => {
    if (buttonsReady && gameReady) {
      import('@/game/core')
        .then(({ EventBus }) => {
          EventBus.ready();
        })
        .catch((error) => {
          console.error('❌ Ошибка загрузки EventBus:', error);
        });
    }
  }, [buttonsReady, gameReady]);

  return (
    <div
      className={cn(
        'relative flex align-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black'
      )}
    >
      <GameInfo />
      <GameButtons onReady={handleReadyButtons} />
      <PhaserGame onReady={handleReadyGame} ref={phaserRef} />

      <BackgroundBeams
        className={cn(
          'opacity-60 mix-blend-screen backdrop-blur-[1px] bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 contrast-125 saturate-150'
        )}
      />
    </div>
  );
}
