import type { ButtonHTMLAttributes, FC } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonBaseProps {
  variant?: 'primary' | 'ghost';
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps &
  ButtonBaseProps;

const buttonClassesPrimary = {
  base: 'flex items-center justify-center px-2 py-1.5 bg-cyan-500 text-xs text-black uppercase tracking-widest cursor-pointer transition-all duration-300',
  hover: 'hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]',
} as const;

const buttonClassesGhost = {
  base: 'flex items-center justify-center px-2 py-1.5 text-xs text-white/40 uppercase tracking-widest font-bold cursor-pointer transition-all duration-300',
  hover: 'hover:text-white',
} as const;

const buttonClasses = {
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale',
} as const;

export const MenuButton: FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    className,
    disabled,
    children,
    ...other
  } = props;

  return (
    <motion.button
      className={cn(
        variant === 'primary'
          ? buttonClassesPrimary.base
          : buttonClassesGhost.base,
        variant === 'primary'
          ? buttonClassesPrimary.hover
          : buttonClassesGhost.hover,
        buttonClasses.focus,
        buttonClasses.disabled,
        className
      )}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={disabled}
      {...other}
    >
      {children}
    </motion.button>
  );
};

MenuButton.displayName = 'MenuButton';

export default MenuButton;
