'use client';

import React, { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PLAYER_NAME_LENGTH } from './constants';
import { BackgroundParticles, ErrorIcon } from './components';

const inputClasses = {
  base: 'w-full h-14 px-5 bg-black/50 backdrop-blur-sm border-2 border-purple-500/30 rounded text-purple-100/90 font-mono text-base placeholder-purple-400/70 transition-all',
  focus:
    'focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/30',
} as const;

const buttonClasses = {
  base: 'w-full h-14 px-5 bg-gray-900/70 backdrop-blur-xs border-2 border-purple-500/30 rounded text-purple-300 font-mono text-base cursor-pointer transition-all duration-150 flex items-center justify-center gap-3',
  hover:
    'hover:text-purple-200 hover:border-purple-400/70 hover:bg-purple-900/30',
  focus: 'focus-visible:outline-none focus-visible:border-purple-600/70',
  disabled: 'disabled:opacity-70 disabled:cursor-not-allowed',
} as const;

export default function MarketingPage() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setPlayerName(value);

    if (error && value.trim()) {
      setError('');
    }
  };

  const handleStartGame = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const trimmedName = playerName.trim();

    setError('');

    if (!trimmedName) {
      setError('Пожалуйста, введите имя игрока');

      return;
    }

    if (trimmedName.length < 2) {
      setError('Имя должно содержать минимум 2 символа');

      return;
    }

    setIsLoading(true);

    router.push(`/game?player=${encodeURIComponent(trimmedName)}`);
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden'
      )}
    >
      {/* Фон */}
      <BackgroundParticles />

      <div className={cn('relative z-10 w-full max-w-md mx-auto')}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn('text-center mb-12')}
        >
          <h1 className={cn('text-5xl md:text-6xl font-bold mb-4')}>
            <span
              className={cn(
                'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase font-mono'
              )}
            >
              Shuffle Battle
            </span>
          </h1>
          <p className={cn('text-lg text-purple-400/80 font-mono')}>
            Твой танцевальный вызов начинается здесь
          </p>
        </motion.div>

        {/* Карточка с формой */}
        <motion.form
          className={cn(
            'bg-black/50 backdrop-blur-sm rounded-lg p-8 border-2 border-purple-500/30 shadow-[0_0_8px_rgba(147,51,234,0.15)]'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={cn('mb-8')}>
            <label
              htmlFor="playerName"
              className={cn('block text-lg font-mono mb-4 text-purple-300/90')}
            >
              Введи своё игровое имя
            </label>

            <div className={cn('relative')}>
              <input
                id="playerName"
                className={cn(inputClasses.base, inputClasses.focus)}
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Например ShuffleMaster"
                autoFocus
                autoComplete="off"
                maxLength={PLAYER_NAME_LENGTH}
                aria-invalid={!!error}
                aria-describedby={error ? 'playerNameError' : undefined}
              />

              <div
                className={cn(
                  'mt-3 flex gap-2 text-sm text-left',
                  error ? 'justify-between' : 'justify-end'
                )}
              >
                {error && (
                  <motion.div
                    id="playerNameError"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'text-red-400 flex items-center gap-2 font-mono'
                    )}
                  >
                    <ErrorIcon />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className={cn('text-purple-300/90 text-right font-mono')}>
                  {playerName.length}/{PLAYER_NAME_LENGTH}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            disabled={isLoading}
            className={cn(
              buttonClasses.base,
              buttonClasses.hover,
              buttonClasses.focus,
              buttonClasses.disabled
            )}
          >
            <span className={cn('text-2xl')}>⏵</span>
            <span className={cn(isLoading ? '' : 'uppercase')}>
              {isLoading ? 'Запуск игры...' : 'Начать игру'}
            </span>
            {isLoading && (
              <div
                className={cn(
                  'w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin'
                )}
              />
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
