'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { LoadingScreen } from './components';
import { useGameLoader } from '@/hooks';

const GameInterface = dynamic(() => import('./components/GameInterface'), {
  ssr: false,
});

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
});

export default function GamePage() {
  const [showGame, setShowGame] = useState<boolean>(false);

  const { isLoading, progress, message, setHUDReady, setGameReady } =
    useGameLoader({
      onComplete: () => {
        console.log('✅ Все компоненты загружены!');
      },
    });

  // Функции обратного вызова для управления состоянием загрузки
  // useCallback обязателен, так как функции передаются в массив зависимостей

  const handleReadyInterface = useCallback((ready: boolean) => {
    setHUDReady(ready);
  }, []);

  const handleReadyGame = useCallback((ready: boolean) => {
    setGameReady(ready);
  }, []);

  const handleLoaded = useCallback(() => {
    setShowGame(true);
  }, []);

  return (
    <div className={cn('bg-gradient-to-br from-gray-900 to-black')}>
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
        <GameInterface onReady={handleReadyInterface} />
        <PhaserGame onReady={handleReadyGame} />
      </div>
    </div>
  );
}
