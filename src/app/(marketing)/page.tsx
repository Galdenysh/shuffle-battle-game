'use client';

import React, { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BackgroundParticles, ErrorIcon } from './components';
import { PLAYER_NAME_LENGTH } from './constants';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Фон */}
      <BackgroundParticles />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              SHUFFLE BATTLE
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Твой танцевальный вызов начинается здесь
          </p>
        </motion.div>

        {/* Карточка с формой */}
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <div className="mb-8">
            <label
              htmlFor="playerName"
              className="block text-lg font-medium mb-3 text-gray-200"
            >
              Введи своё игровое имя
            </label>

            <div className="relative">
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Например: ShuffleMaster"
                autoFocus
                autoComplete="off"
                maxLength={PLAYER_NAME_LENGTH}
                aria-invalid={!!error}
                aria-describedby={error ? 'playerNameError' : undefined}
                className="w-full px-5 py-4 bg-black/50 border-2 border-purple-500/50 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
              />

              <div
                className={clsx(
                  'mt-2 flex gap-2 text-sm text-right',
                  error ? 'justify-between' : 'justify-end'
                )}
              >
                {error && (
                  <motion.div
                    id="playerNameError"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 flex items-center gap-1"
                  >
                    <ErrorIcon />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="text-gray-400 text-right">
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
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white text-xl font-bold shadow-lg shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Запуск игры...
              </>
            ) : (
              <>
                <span className="text-2xl">🎮</span>
                <span className="uppercase">Начать игру</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
