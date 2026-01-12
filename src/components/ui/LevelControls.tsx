import React from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuButton from './MenuButton';
import { cn } from '@/lib/utils';
import { GameState } from '@/types';

interface LevelControlsProps {
  gameState?: GameState;
  onRestart?: () => void;
}

export const LevelControls: FC<LevelControlsProps> = ({
  gameState = GameState.INIT,
  onRestart,
}) => {
  const isFinished = gameState === GameState.FINISHED;

  return (
    <AnimatePresence>
      {isFinished && (
        <motion.div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-2'
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.2,
          }}
        >
          <MenuButton fullWidth onClick={onRestart} onTouchStart={onRestart}>
            Попробовать снова
          </MenuButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

LevelControls.displayName = 'LevelControls';

export default LevelControls;
