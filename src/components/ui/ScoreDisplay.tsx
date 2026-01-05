import React, { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  totalScore?: number | string;
  deltaScore?: number | string | null;
  comboChain?: number | string;
  timestamp?: number | string;
}

const textClasses =
  'text-base text-cyan-300/90 font-mono tracking-wider drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]';

export const ScoreDisplay: FC<ScoreDisplayProps> = ({
  totalScore = 0,
  deltaScore = null,
  comboChain = 1,
  timestamp = 0,
}) => {
  const [displayScore, setDisplayScore] = useState<number>(Number(totalScore));
  const [currentDelta, setCurrentDelta] = useState<number | null>(null);
  const [isAnimatingScore, setIsAnimatingScore] = useState<boolean>(false);

  const prevTotalScore = useRef<number>(Number(totalScore));
  const scoreAnimationRef = useRef<NodeJS.Timeout | null>(null);

  // Обработка изменения счета и дельты
  useEffect(() => {
    const currentScore = Number(totalScore);
    const prevScore = prevTotalScore.current;

    if (currentScore !== prevScore) {
      if (deltaScore !== null && deltaScore !== undefined) {
        setCurrentDelta(Number(deltaScore));
      }

      // Запускаем анимацию изменения счета после исчезновения дельты
      const startAnimation = () => {
        setIsAnimatingScore(true);
        setDisplayScore(prevScore);

        // Анимация плавного увеличения счета
        const startTime = Date.now();
        const duration = 1000;
        const difference = currentScore - prevScore;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Кубическое замедление (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentValue = prevScore + difference * easeOut;

          setDisplayScore(Math.floor(currentValue));

          if (progress < 1) {
            scoreAnimationRef.current = setTimeout(animate, 16); // ~60fps
          } else {
            setDisplayScore(currentScore);
            setIsAnimatingScore(false);
          }
        };

        animate();
      };

      const timer = setTimeout(startAnimation, 500);

      prevTotalScore.current = currentScore;

      return () => {
        clearTimeout(timer);

        if (scoreAnimationRef.current) {
          clearTimeout(scoreAnimationRef.current);
        }
      };
    }
  }, [timestamp, totalScore, deltaScore]);

  // Таймер для скрытия дельты
  useEffect(() => {
    if (currentDelta !== null) {
      const timer = setTimeout(() => {
        setCurrentDelta(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentDelta]);

  return (
    <div className={cn('flex gap-2')}>
      <div
        className={cn('flex flex-col gap-1 p-2 -m-2 w-fit', 'backdrop-blur-sm')}
      >
        <p className={cn(textClasses, 'relative')}>
          Очки:{' '}
          <motion.span
            key={`score-${timestamp}`}
            className={cn('font-bold text-white')}
            animate={
              isAnimatingScore
                ? {
                    scale: [1, 1.1, 1],
                    color: ['#ffffff', '#06b6d4', '#ffffff'],
                    transition: {
                      duration: 1,
                      times: [0, 0.5, 1],
                    },
                  }
                : {}
            }
          >
            {displayScore.toLocaleString()}
          </motion.span>
        </p>

        <p className={cn(textClasses)}>
          Цепь: <span className={cn('font-bold text-white')}>{comboChain}</span>
        </p>
      </div>

      {/* Анимация дельты */}
      <AnimatePresence mode="wait">
        {currentDelta !== null && (
          <motion.div
            key={`delta-${timestamp}`}
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className={cn(textClasses, 'absolute font-bold text-white z-10')}
              initial={{
                opacity: 0,
                scale: 0.5,
                y: 20,
                x: -20,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1.1, 1],
                y: [20, -10, -20, -30],
                x: [-20, 0, 10, 20],
                transition: {
                  duration: 1.5,
                  times: [0, 0.2, 0.8, 1],
                  ease: 'easeOut',
                },
              }}
            >
              {Number(currentDelta) > 0 ? '+' : ''}
              {currentDelta}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ScoreDisplay.displayName = 'ScoreDisplay';

export default ScoreDisplay;
