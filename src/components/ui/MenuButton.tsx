import React from 'react';
import type { ButtonHTMLAttributes, FC } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonBaseProps {
  loading?: boolean;
  fullWidth?: boolean;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps &
  ButtonBaseProps;

const buttonClasses = {
  base: 'flex items-center justify-center h-14 px-5 gap-3 bg-gradient-to-r from-gray-800/30 via-black to-gray-800/30 border-2 border-cyan-500/50 text-cyan-300 font-mono text-lg tracking-wider cursor-pointer transition-all duration-300',
  hover:
    'hover:border-cyan-300 hover:text-white hover:shadow-[0_0_25px_rgba(0,255,255,0.6),inset_0_0_20px_rgba(0,255,255,0.1)]',
  active:
    'active:shadow-[0_0_15px_rgba(0,255,255,0.4),inset_0_0_15px_rgba(0,0,0,0.3)]',
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:hover:border-cyan-500/50',
} as const;

export const MenuButton: FC<ButtonProps> = (props) => {
  const {
    className,
    disabled,
    loading,
    fullWidth,
    onClick,
    children,
    ...other
  } = props;

  return (
    <motion.button
      className={cn(
        buttonClasses.base,
        buttonClasses.hover,
        buttonClasses.active,
        buttonClasses.focus,
        buttonClasses.disabled,
        fullWidth ? 'w-full' : '',
        className
      )}
      type="submit"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      {...other}
    >
      {loading && (
        <div
          className={cn(
            'w-5 h-5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin'
          )}
        />
      )}
      {children}
    </motion.button>
  );
};

MenuButton.displayName = 'MenuButton';

export default MenuButton;
