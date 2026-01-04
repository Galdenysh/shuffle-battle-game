import React from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const MenuTitle: FC<TitleProps> = ({ title, subtitle, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn('flex flex-col gap-6 text-center', className)}
    >
      <h1
        className={cn(
          'text-5xl md:text-6xl font-bold bg-clip-text text-transparent uppercase font-mono tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]'
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            'text-xl text-purple-300/90 font-mono tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'
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
