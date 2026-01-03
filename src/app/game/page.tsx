'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { RefPhaserGame } from '@/components/PhaserGame';
import { cn } from '@/lib/utils';
import { GameInfo, LoadingScreen } from './components';
import { BackgroundBeams } from '@/components/ui';
import { useGameLoader } from '@/hooks';

const GameButtons = dynamic(() => import('./components/GameButtons'), {
  ssr: false,
});

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
});

export default function GamePage() {
  const [showGame, setShowGame] = useState<boolean>(false);

  const { isLoading, progress, message, setButtonsReady, setGameReady } =
    useGameLoader({
      onComplete: () => {
        console.log('✅ Все компоненты загружены!');
      },
    });

  const handleReadyButtons = useCallback((ready: boolean) => {
    setButtonsReady(ready);
  }, []);

  const handleReadyGame = useCallback((ready: boolean) => {
    setGameReady(ready);
  }, []);

  const handleLoaded = useCallback(() => {
    setShowGame(true);
  }, []);

  return (
    <>
      <div className={cn('bg-gradient-to-br from-gray-900 to-black')}>
        <BackgroundBeams
          className={cn(
            'opacity-60 mix-blend-screen backdrop-blur-[1px] bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 contrast-125 saturate-150'
          )}
        />

        <LoadingScreen
          progress={progress}
          message={message}
          isLoading={isLoading}
          onLoaded={handleLoaded}
        />

        <div
          className={cn(
            'relative flex align-center justify-center h-screen transition-opacity duration-300',
            showGame ? 'opacity-100' : 'opacity-0'
          )}
        >
          <GameInfo />
          <GameButtons onReady={handleReadyButtons} />
          <PhaserGame onReady={handleReadyGame} />
        </div>
      </div>
    </>
  );
}
