'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Modal,
  ModalTrigger,
  MuteIcon,
  RulesIcon,
  ShowHideIcon,
} from '@/components/ui';
import { TutorialModalBody } from '@/components/shared';
import { DEFAULT_VALUES, STORAGE_KEYS } from '@/lib/constants';

interface GameInfoProps {
  isVisibleGamepad?: boolean;
  isMuted?: boolean;
  onVisibleGamepad?: (isVisible: boolean) => void;
  onMuted?: () => void;
}

const buttonClasses = {
  base: 'px-2 min-h-8 bg-gray-900/70 backdrop-blur-xs border border-purple-500/30 text-cyan-400 font-mono text-[10px] cursor-pointer transition-all duration-150',
  baseIcon: 'flex justify-center items-center p-0 w-8 h-8',
  hover:
    'hover:text-cyan-200 hover:border-purple-400/70 hover:bg-purple-900/30',
  active: 'active:scale-95',
  focus: 'focus-visible:outline-none focus-visible:border-purple-600/70',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale',
} as const;

const GameInfo: FC<GameInfoProps> = ({
  isVisibleGamepad = true,
  isMuted = false,
  onVisibleGamepad,
  onMuted,
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const playerName =
    (typeof window !== 'undefined' &&
      sessionStorage.getItem(STORAGE_KEYS.PLAYER_NAME)) ||
    DEFAULT_VALUES.PLAYER_NAME;

  const toggleGamepadText = `${
    isVisibleGamepad ? 'Скрыть' : 'Показать'
  } кнопки управления`;

  const toggleSoundText = `${isMuted ? 'Включить' : 'Выключить'} звук`;

  const handleName = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMuted = () => {
    onMuted?.();
  };

  const handleVisibleGamepad = () => {
    onVisibleGamepad?.(!isVisibleGamepad);
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div
      className={cn(
        'absolute top-2 right-2 z-150',
        'flex items-center gap-1.5',
        'min-w-fit px-1.5 py-1.5',
        'bg-black/50 backdrop-blur-sm border-2 border-purple-500/30',
        'shadow-[0_0_4px_rgba(147,51,234,0.15)]',
        'text-purple-300/90 font-mono text-xs'
      )}
    >
      <div
        className={cn(
          'flex items-center',
          'px-1 py-0.5',
          'cursor-pointer select-none',
          'hover:bg-purple-500/10 transition-all duration-300'
        )}
        onClick={handleName}
      >
        <span className="text-purple-400/80 text-[10px]">
          {`PL${isExpanded ? ':' : ''}`}
        </span>

        <motion.div
          className="overflow-hidden whitespace-nowrap"
          initial={false}
          animate={{
            width: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={
            isExpanded
              ? {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }
              : {
                  type: 'tween',
                  duration: 0.2,
                  ease: 'circOut',
                }
          }
        >
          <span className="text-purple-100/90 text-xs font-medium">
            {playerName.slice(0, 16)}
            {playerName.length > 16 ? '...' : ''}
          </span>
        </motion.div>
      </div>
      <div className="h-3 w-px bg-purple-600/50" />
      <Modal>
        <ModalTrigger>
          <button
            className={cn(
              buttonClasses.base,
              buttonClasses.baseIcon,
              buttonClasses.hover,
              buttonClasses.active,
              buttonClasses.focus,
              buttonClasses.disabled
            )}
            type="button"
            title="Инструкция к битве"
            aria-label="Инструкция к битве"
          >
            <RulesIcon />
          </button>
        </ModalTrigger>
        <TutorialModalBody />
      </Modal>

      <button
        className={cn(
          buttonClasses.base,
          buttonClasses.baseIcon,
          buttonClasses.hover,
          buttonClasses.active,
          buttonClasses.focus,
          buttonClasses.disabled
        )}
        type="button"
        title={toggleGamepadText}
        aria-label={toggleGamepadText}
        onClick={handleVisibleGamepad}
        onTouchStart={handleVisibleGamepad}
      >
        <ShowHideIcon isShow={isVisibleGamepad} />
      </button>
      <button
        className={cn(
          buttonClasses.base,
          buttonClasses.baseIcon,
          buttonClasses.hover,
          buttonClasses.active,
          buttonClasses.focus,
          buttonClasses.disabled
        )}
        type="button"
        title={toggleSoundText}
        aria-label={toggleSoundText}
        onClick={handleMuted}
        onTouchStart={handleMuted}
      >
        <MuteIcon isMuted={isMuted} />
      </button>
      <div className="h-3 w-px bg-purple-600/50" />
      <button
        className={cn(
          buttonClasses.base,
          buttonClasses.hover,
          buttonClasses.active,
          buttonClasses.focus,
          buttonClasses.disabled
        )}
        type="button"
        title="Выйти в меню"
        onClick={handleExit}
        onTouchStart={handleExit}
      >
        EXIT
      </button>
    </div>
  );
};

GameInfo.displayName = 'GameInfo';

export default GameInfo;
