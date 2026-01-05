'use client';

import { useState, useEffect } from 'react';

interface LoadingState {
  hud: boolean;
  game: boolean;
  eventBus: boolean;
}

interface UseGameLoaderProps {
  onComplete?: () => void;
}

export function useGameLoader({ onComplete }: UseGameLoaderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    hud: false,
    game: false,
    eventBus: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Инициализация...');
  const [progress, setProgress] = useState(0);

  const updateProgress = (updates: Partial<LoadingState>) => {
    setLoadingState((prev) => ({ ...prev, ...updates }));
  };

  const calculateTotalProgress = () => {
    const totalSteps = 3; // hud, game, eventBus
    const completedSteps = Object.values(loadingState).filter(Boolean).length;

    return Math.floor((completedSteps / totalSteps) * 100);
  };

  const updateMessage = (state: LoadingState) => {
    if (!state.game) {
      setMessage('Загрузка игрового движка...');
    } else if (!state.hud) {
      setMessage('Загрузка игрового интерфейса...');
    } else if (!state.eventBus) {
      setMessage('Загрузка событий и ресурсов...');
    }
  };

  const activateEventBus = async (timer: NodeJS.Timeout | null) => {
    try {
      const { EventBus } = await import('@/game/core');

      EventBus.ready();

      updateProgress({ eventBus: true });
      setMessage('Готово! Запуск игры...');

      timer = setTimeout(() => {
        setIsLoading(false);

        onComplete?.();
      }, 500); // Задержка для плавности
    } catch (error) {
      console.error('❌ Ошибка загрузки EventBus:', error);

      setMessage('Ошибка! Обновите страницу.');
    }
  };

  // Обновляем прогресс и сообщение при изменении состояния
  useEffect(() => {
    const currentProgress = calculateTotalProgress();

    setProgress(currentProgress);
    updateMessage(loadingState);
  }, [loadingState.hud, loadingState.game, loadingState.eventBus]);

  // Активируем EventBus когда оба компонента готовы
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (loadingState.hud && loadingState.game && !loadingState.eventBus) {
      activateEventBus(timer);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadingState.hud, loadingState.game, loadingState.eventBus]);

  // Методы для установки состояния загрузки компонентов
  const setHUDReady = (ready: boolean) => {
    updateProgress({ hud: ready });
  };

  const setGameReady = (ready: boolean) => {
    updateProgress({ game: ready });
  };

  return {
    isLoading,
    progress,
    message,
    loadingState,
    setHUDReady,
    setGameReady,
  };
}
