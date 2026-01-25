'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BackgroundParticles,
  TutorialArrows,
  TutorialModalSnackbar,
} from './components';
import {
  MenuButton,
  MenuGhostButton,
  MenuInput,
  MenuTitle,
  Modal,
  ModalTrigger,
} from '@/components/ui';
import { TutorialModalBody } from '@/components/shared';
import { STORAGE_KEYS } from '@/lib/constants';

export default function MarketingPage() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPlayerName(value);

    if (error && value.trim()) {
      setError('');
    }
  };

  const handleTutorialClick = () => {
    setShowHint(false);

    localStorage.setItem('onboarding_complete', 'true');
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

    sessionStorage.setItem(STORAGE_KEYS.PLAYER_NAME, trimmedName);

    router.push('/game');
  };

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('onboarding_complete');

    if (!tutorialSeen) setShowHint(true);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full min-h-full p-4',
        'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'
      )}
    >
      <BackgroundParticles />

      <div className={cn('max-w-md')}>
        <MenuTitle
          className="mb-12"
          title="Shuffle Battle"
          subtitle="Твой танцевальный вызов начинается здесь"
        />

        <motion.form
          className={cn(
            'flex flex-col items-center p-8 gap-8',
            'bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.2),0_0_20px_rgba(0,255,255,0.1)]',
            'border-2 [border-image:linear-gradient(to_bottom_right,theme(colors.purple.500/0.3),theme(colors.cyan.500/0.3))_1]'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MenuInput
            id="playerName"
            label="Укажи свой Shuffle ID"
            errorHint={error}
            placeholder="Например: NEON_STEPPER_01"
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

          <Modal>
            <ModalTrigger>
              <MenuGhostButton
                className="relative uppercase"
                onClick={handleTutorialClick}
                onTouchStart={handleTutorialClick}
              >
                Инструкция к битве
                <TutorialArrows show={showHint} />
              </MenuGhostButton>
            </ModalTrigger>
            <TutorialModalSnackbar
              show={showHint}
              onOpen={handleTutorialClick}
              onClose={handleTutorialClick}
            />
            <TutorialModalBody />
          </Modal>
        </motion.form>
      </div>
    </div>
  );
}
