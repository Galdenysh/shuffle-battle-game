'use client';

import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  onLoaded?: () => void;
}

const LOADING_TIPS = [
  'Используйте стрелки или WASD для движения',
  'F - активирует/деактивирует возможность движения',
  'Используйте R, T, Y вместе с клавишами движения',
  'На мобильных устройствах используйте touch-управление',
  'RM создает иллюзию бега, T-Step - скольжение влево-вправо',
  'RM = Running Man, T(L/R) = T-Step левой/правой ногой',
];

const TIP_CHANGE_INTERVAL = 3000;

const getRandomTip = (currentTipIndex: number): number => {
  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * LOADING_TIPS.length);
  } while (newIndex === currentTipIndex && LOADING_TIPS.length > 1);

  return newIndex;
};

const LoadingScreen: FC<LoadingScreenProps> = ({
  isLoading,
  message = 'Загрузка...',
  progress = 0,
  onLoaded,
}) => {
  const [show, setShow] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Получение текущей подсказки
  const getCurrentTip = () => {
    return isMounted ? `💡 ${LOADING_TIPS[currentTipIndex]}` : '';
  };

  // Обработчик завершения загрузки
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);

        onLoaded?.();
      }, 500); // Задержка для плавности

      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoaded]);

  // Получение первой случайно подсказки
  useEffect(() => {
    setIsMounted(true);
    setCurrentTipIndex(Math.floor(Math.random() * LOADING_TIPS.length));
  }, []);

  // Переключение случайной подсказки
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prevIndex) => getRandomTip(prevIndex));
      }, TIP_CHANGE_INTERVAL);

      // Очищаем интервал при размонтировании или завершении загрузки
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent text-white'
      )}
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-start space-y-8 w-80 h-50 mx-auto px-4">
        {/* Прогресс-бар */}
        <div className="w-full space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>{message}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>

        {/* Индикатор загрузки */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Советы во время загрузки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-gray-400 text-sm"
          >
            <p>{getCurrentTip()}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
