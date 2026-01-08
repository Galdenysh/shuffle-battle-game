import React from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  timeLeft: number | null;
  isWarning: boolean;
  isCritical: boolean;
  isTimeUp: boolean;
}

export const CountdownTimer: FC<CountdownTimerProps> = ({
  timeLeft,
  isWarning,
  isCritical,
  isTimeUp,
}) => {
  const getTextClasses = () => {
    const baseClasses =
      'text-6xl font-mono font-bold drop-shadow-[0_0_2px_rgba(6,182,212,0.4)]';

    if (isTimeUp) {
      return cn(baseClasses, 'text-red-600');
    }

    if (isCritical) {
      return cn(baseClasses, 'text-red-600');
    }

    if (isWarning) {
      return cn(baseClasses, 'text-amber-300');
    }

    return cn(baseClasses, 'text-white');
  };

  const textClasses = getTextClasses();

  const formatSeconds = (sec: number): string => {
    return Math.max(0, sec).toString().padStart(2, '0');
  };

  if (timeLeft === null) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-col gap-1 p-2 -m-2 w-fit', 'backdrop-blur-sm')}
    >
      <motion.div
        animate={
          isCritical
            ? {
                scale: [1, 1.05, 1],
                transition: { duration: 0.5, repeat: Infinity },
              }
            : {}
        }
      >
        <motion.span
          key={`time-${timeLeft}`}
          className={textClasses}
          initial={{ scale: 1.15, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            duration: 0.15,
          }}
        >
          {formatSeconds(timeLeft)}
        </motion.span>
      </motion.div>
    </div>
  );
};

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer;
