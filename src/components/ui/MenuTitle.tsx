import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TitleProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  className?: string;
}

export const MenuTitle: FC<TitleProps> = ({ title, subtitle, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'tween',
        ease: 'easeOut',
        duration: 0.6,
      }}
      className={cn('flex flex-col gap-6 text-center', className)}
    >
      <h1
        className={cn(
          'font-header text-5xl md:text-6xl text-white font-black uppercase tracking-wider drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]'
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            'text-xl text-purple-300/90 tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

MenuTitle.displayName = 'MenuTitle';

export default MenuTitle;
