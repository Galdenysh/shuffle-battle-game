'use client';

import type { FC } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '.';
import { useMounted } from '@/hooks';

interface SnackbarProps {
  show?: boolean;
  title?: string;
  description?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const Snackbar: FC<SnackbarProps> = ({
  show = false,
  title,
  description,
  onOpen,
  onClose,
}) => {
  const mounted = useMounted();

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className={cn(
            'fixed top-0 left-0 right-0 flex p-4 pointer-events-none',
            'justify-center',
            'md:justify-end'
          )}
        >
          <div
            className={cn(
              'relative flex items-center gap-5 p-5 pointer-events-auto',
              'bg-black/80 backdrop-blur-2xl',
              'border-2 [border-image:linear-gradient(to_bottom_right,theme(colors.purple.500/0.5),theme(colors.cyan.500/0.5))_1]',
              'shadow-[0_0_40px_rgba(147,51,234,0.15),0_0_20px_rgba(0,255,255,0.1)]',
              'min-w-[280px] max-w-[420px] overflow-hidden'
            )}
          >
            <div className="flex-1 min-w-0">
              {title && (
                <h3
                  className={cn(
                    'mb-2 text-cyan-400 font-bold text-xs tracking-[0.2em] uppercase',
                    'drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]'
                  )}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-white font-medium text-sm leading-tight tracking-tight">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={onOpen}
                onTouchStart={onOpen}
              >
                Открыть
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  console.log('123');

                  onClose?.();
                }}
                onTouchStart={onClose}
              >
                Пропустить
              </Button>
            </div>

            <motion.div
              className="absolute top-0 bottom-0 w-[2px] bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              animate={{ left: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

Snackbar.displayName = 'Snackbar';

export default Snackbar;
