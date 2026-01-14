'use client';

import React, { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BackgroundParticles } from './components';
import {
  MenuButton,
  MenuInput,
  MenuGhostButton,
  MenuTitle,
} from '@/components/ui';

export default function MarketingPage() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

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
      <BackgroundParticles />

      <div className={cn('w-full max-w-md mx-auto')}>
        <MenuTitle
          className="mb-12"
          title="Shuffle Battle"
          subtitle="Твой танцевальный вызов начинается здесь"
        />

        <motion.form
          className={cn(
            'flex flex-col items-center p-8 gap-8 bg-black/60 backdrop-blur-xl border-2 shadow-[0_0_40px_rgba(147,51,234,0.2),0_0_20px_rgba(0,255,255,0.1)]',
            '[border-image:linear-gradient(to_bottom_right,theme(colors.purple.500/0.3),theme(colors.cyan.500/0.3))_1]'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MenuInput
            id="playerName"
            label="Введи своё игровое имя"
            errorHint={error}
            placeholder="Например: SHUFFLE_MASTER"
            value={playerName}
            fullWidth
            onChange={handleNameChange}
          />

          <MenuButton
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            onClick={handleStartGame}
          >
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
                'uppercase drop-shadow-[0_0_3px_rgba(0,255,255,0.6)]'
              )}
            >
              {isLoading ? 'Запуск игры...' : 'Начать игру'}
            </span>
          </MenuButton>
          <MenuGhostButton className="uppercase">
            Инструкция к битве
          </MenuGhostButton>
        </motion.form>
      </div>
    </div>
  );
}
