'use client';

import React, { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PLAYER_NAME_LENGTH } from './constants';
import { BackgroundParticles, ErrorIcon } from './components';

const inputClasses = {
  base: 'w-full h-14 px-5 bg-black/60 backdrop-blur-md border-2 text-cyan-100/90 font-mono text-base tracking-wider placeholder-cyan-400/50 transition-all duration-300',
  focus:
    'focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.4),inset_0_0_10px_rgba(0,255,255,0.1)]',
  error: 'border-red-500/70 shadow-[0_0_15px_rgba(255,0,0,0.3)]',
} as const;

const buttonClasses = {
  base: 'flex items-center justify-center w-full h-14 px-5 gap-3 bg-gradient-to-r from-cyan-500/6 via-purple-500/4 to-pink-500/6 border-2 border-cyan-500/50 text-cyan-300 font-mono text-lg tracking-wider cursor-pointer transition-all duration-300',
  hover:
    'hover:border-cyan-300 hover:text-white hover:shadow-[0_0_25px_rgba(0,255,255,0.6),inset_0_0_20px_rgba(0,255,255,0.1)] hover:from-gray-800 hover:via-black hover:to-gray-800',
  active:
    'active:scale-[0.98] active:shadow-[0_0_15px_rgba(0,255,255,0.4),inset_0_0_15px_rgba(0,0,0,0.3)]',
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:hover:border-cyan-500/50',
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
        'flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'
      )}
    >
      {/* Фон */}
      <BackgroundParticles />

      <div className={cn('w-full max-w-md mx-auto')}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn('text-center mb-12')}
        >
          <h1 className={cn('text-5xl md:text-6xl font-bold mb-6')}>
            <span
              className={cn(
                'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase font-mono tracking-wider drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]'
              )}
            >
              Shuffle Battle
            </span>
          </h1>
          <p
            className={cn(
              'text-xl text-purple-300/90 font-mono tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'
            )}
          >
            Твой танцевальный вызов начинается здесь
          </p>
        </motion.div>

        {/* Карточка с формой */}
        <motion.form
          className={cn(
            'p-8 bg-black/60 backdrop-blur-xl border-2 shadow-[0_0_40px_rgba(147,51,234,0.2),0_0_20px_rgba(0,255,255,0.1)]',
            '[border-image:linear-gradient(to_bottom_right,theme(colors.purple.500/0.3),theme(colors.cyan.500/0.3))_1]'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={cn('mb-8')}>
            <label
              htmlFor="playerName"
              className={cn(
                'block text-lg font-mono mb-4 text-cyan-300/90 tracking-wider drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]'
              )}
            >
              Введи своё игровое имя
            </label>

            <div>
              <input
                id="playerName"
                className={cn(
                  inputClasses.base,
                  error ? inputClasses.error : 'border-cyan-500/50',
                  inputClasses.focus
                )}
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Например: SHUFFLE_MASTER"
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
                      'flex items-center gap-2 text-red-400 font-mono tracking-wider drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]'
                    )}
                  >
                    <ErrorIcon />
                    {error}
                  </motion.div>
                )}

                <div
                  className={cn(
                    'text-cyan-300/90 text-right font-mono tracking-wider drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]'
                  )}
                >
                  {playerName.length}/{PLAYER_NAME_LENGTH}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartGame}
            disabled={isLoading}
            className={cn(
              buttonClasses.base,
              buttonClasses.hover,
              buttonClasses.active,
              buttonClasses.focus,
              buttonClasses.disabled
            )}
          >
            {isLoading && (
              <div
                className={cn(
                  'w-5 h-5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin'
                )}
              />
            )}
            {!isLoading && (
              <span
                className={cn(
                  'text-2xl drop-shadow-[0_0_3px_rgba(0,255,255,0.6)]'
                )}
              >
                ⏵
              </span>
            )}
            <span
              className={cn(
                isLoading ? '' : 'uppercase',
                'drop-shadow-[0_0_3px_rgba(0,255,255,0.6)]'
              )}
            >
              {isLoading ? 'Запуск игры...' : 'Начать игру'}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
