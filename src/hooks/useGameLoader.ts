'use client';

import { useState, useEffect } from 'react';

interface LoadingState {
  hudMounted: boolean;
  gameMounted: boolean;
  eventBus: boolean;
  gameReady: boolean;
}

interface UseGameLoaderProps {
  onComplete?: () => void;
}

export function useGameLoader({ onComplete }: UseGameLoaderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    hudMounted: false,
    gameMounted: false,
    eventBus: false,
    gameReady: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Инициализация...');
  const [progress, setProgress] = useState(0);

  const updateProgress = (updates: Partial<LoadingState>) => {
    setLoadingState((prev) => ({ ...prev, ...updates }));
  };

  const calculateTotalProgress = (state: LoadingState) => {
    const steps = Object.values(state);
    const completed = steps.filter(Boolean).length;

    return Math.floor((completed / steps.length) * 100);
  };

  const updateMessage = (state: LoadingState) => {
    if (!state.hudMounted || !state.gameMounted) {
      setMessage('Загрузка игрового интерфейса...');
    } else if (!state.eventBus) {
      setMessage('Загрузка системы событий...');
    } else if (!state.gameReady) {
      setMessage('Загрузка игровых ресурсов...');
    } else if (state.gameReady){
      setMessage('Готово! Запуск игры...');
    }
  };

  const activateEventBus = async () => {
    try {
      const { EventBus } = await import('@/game/core');

      EventBus.ready();

      updateProgress({ eventBus: true });
    } catch (error) {
      console.error('❌ Ошибка загрузки EventBus:', error);

      setMessage('Ошибка! Обновите страницу.');
    }
  };

  // Обновляем прогресс и сообщение при изменении состояния
  useEffect(() => {
    const currentProgress = calculateTotalProgress(loadingState);

    setProgress(currentProgress);
    updateMessage(loadingState);
  }, [
    loadingState.hudMounted,
    loadingState.gameMounted,
    loadingState.eventBus,
    loadingState.gameReady,
  ]);

  // Активируем EventBus когда оба компонента готовы
  useEffect(() => {
    if (
      loadingState.hudMounted &&
      loadingState.gameMounted &&
      !loadingState.eventBus
    ) {
      activateEventBus();
    }
  }, [
    loadingState.hudMounted,
    loadingState.gameMounted,
    loadingState.eventBus,
  ]);

  // Завершение загрузки
  useEffect(() => {
    if (loadingState.gameReady && loadingState.eventBus) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 300); // Небольшая пауза для плавности

      return () => {
        clearTimeout(timer);
      };
    }
  }, [loadingState.gameReady, loadingState.eventBus, onComplete]);

  // Методы для установки состояния загрузки компонентов
  const setHUDMounted = (isMounted: boolean) => {
    updateProgress({ hudMounted: isMounted });
  };

  const setGameMounted = (isMounted: boolean) => {
    updateProgress({ gameMounted: isMounted });
  };

  const setGameReady = (isReady: boolean) => {
    updateProgress({ gameReady: isReady });
  };

  return {
    isLoading,
    progress,
    message,
    loadingState,
    setHUDMounted,
    setGameMounted,
    setGameReady,
  };
}
