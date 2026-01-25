import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';

const TutorialArrows: FC<{ show?: boolean }> = ({ show = false }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className={cn(
                'absolute top-0 left-full pl-4 flex pointer-events-none w-max',
                'text-cyan-400 text-2xl'
              )}
              animate={{ x: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ◀
            </motion.span>
            <motion.span
              className={cn(
                'absolute top-0 right-full pr-4 flex pointer-events-none w-max',
                'text-cyan-400 text-2xl'
              )}
              animate={{ x: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ▶
            </motion.span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

TutorialArrows.displayName = 'TutorialArrows';

export default TutorialArrows;
