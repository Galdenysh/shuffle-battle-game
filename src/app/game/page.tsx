'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Game } from 'phaser';
import { motion } from 'framer-motion';
import { LoadingScreen } from './components';
import { useGameLoader } from '@/hooks';
import { cn } from '@/lib/utils';
import type { RefPhaserGame } from './components/PhaserGame';

const GameInterface = dynamic(() => import('./components/GameInterface'), {
  ssr: false,
});

const PhaserGame = dynamic(() => import('./components/PhaserGame'), {
  ssr: false,
});

export default function GamePage() {
  const [showGame, setShowGame] = useState<boolean>(false);
  const [gameInstance, setGameInstance] = useState<Game | null>(null);

  // useCallback обязателен, так как функция передается в массив зависимостей
  const onComplete = useCallback(() => {
    console.log('✅ Все компоненты загружены!');
  }, []);

  const {
    isLoading,
    progress,
    message,
    setHUDMounted,
    setGameMounted,
    setGameReady,
  } = useGameLoader({ onComplete });

  const onGameReady = useCallback((ref: RefPhaserGame | null) => {
    const gameRef = ref;

    if (gameRef?.game) {
      setGameInstance(gameRef?.game);
    }
  }, []);

  // Функции обратного вызова для управления состоянием загрузки
  // useCallback обязателен, так как функции передаются в массив зависимостей

  const handleMountedInterface = useCallback((isMounted: boolean) => {
    setHUDMounted(isMounted);
  }, []);

  const handleMountedGame = useCallback((isMounted: boolean) => {
    setGameMounted(isMounted);
  }, []);

  const handleReadyGame = useCallback((isReady: boolean) => {
    setGameReady(isReady);
  }, []);

  const handleLoaded = useCallback(() => {
    setShowGame(true);
  }, []);

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden flex items-center justify-center',
        'bg-gradient-to-br from-gray-900 to-black'
      )}
    >
      <LoadingScreen
        progress={progress}
        message={message}
        isLoading={isLoading}
        onLoaded={handleLoaded}
      />

      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showGame ? 1 : 0,
          pointerEvents: showGame ? 'auto' : 'none',
        }}
      >
        <GameInterface
          gameInstance={gameInstance}
          onMounted={handleMountedInterface}
        />
        <PhaserGame
          onMounted={handleMountedGame}
          onGameReady={handleReadyGame}
          ref={onGameReady}
        />
      </motion.div>
    </div>
  );
}
