import { cn } from '@/lib/utils';
import React from 'react';
import type { ButtonHTMLAttributes, FC } from 'react';
import { motion, MotionProps } from 'framer-motion';

const buttonClasses = {
  base: 'w-fit min-h-8 flex items-center justify-center text-cyan-400/70 text-sm font-mono tracking-tighter underline underline-offset-4 decoration-cyan-500/30 cursor-pointer transition-all duration-300',
  hover: 'hover:text-cyan-400 hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]',
  active: 'active:drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]',
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:hover:border-cyan-500/50',
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

const MenuGhostButton: FC<ButtonProps> = (props) => {
  const { className, children, ...other } = props;

  return (
    <motion.button
      className={cn(
        buttonClasses.base,
        buttonClasses.hover,
        buttonClasses.active,
        buttonClasses.focus,
        buttonClasses.disabled,
        className
      )}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...other}
    >
      {children}
    </motion.button>
  );
};

MenuGhostButton.displayName = 'MenuGhostButton';

export default MenuGhostButton;
