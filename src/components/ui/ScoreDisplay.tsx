import React from 'react';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  totalScore?: number | string;
  comboChain?: number | string;
}

const textClasses =
  'text-white text-base text-cyan-300/90 font-mono tracking-wider drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]';

const digitsClasses = 'font-bold';

export const ScoreDisplay: FC<ScoreDisplayProps> = ({
  totalScore = 0,
  comboChain = 1,
}) => {
  return (
    <div
      className={cn('flex flex-col gap-1 p-2 -m-2 w-fit', 'backdrop-blur-sm')}
    >
      <p className={cn(textClasses)}>
        Очков: <span className={cn('font-bold text-white')}>{totalScore}</span>
      </p>
      <p className={cn(textClasses)}>
        Комбо: <span className={cn('font-bold text-white')}>{comboChain}</span>
      </p>
    </div>
  );
};

ScoreDisplay.displayName = 'ScoreDisplay';

export default ScoreDisplay;
