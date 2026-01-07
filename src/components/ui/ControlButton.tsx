import React, { useState } from 'react';
import type {
  FC,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  RefCallback,
  TouchEvent,
} from 'react';
import { cn } from '@/lib/utils';

interface ControlButtonProps {
  isToggleOn?: boolean;
  fullWidth?: boolean;
  label?: string;
  icon?: ReactNode;
  'aria-label'?: string;
  onMouseDown?: HTMLAttributes<HTMLButtonElement>['onMouseDown'];
  onMouseUp?: HTMLAttributes<HTMLButtonElement>['onMouseUp'];
  onTouchStart?: HTMLAttributes<HTMLButtonElement>['onTouchStart'];
  onTouchEnd?: HTMLAttributes<HTMLButtonElement>['onTouchEnd'];
  onTouchCancel?: HTMLAttributes<HTMLButtonElement>['onTouchCancel'];
  ref?: RefCallback<HTMLButtonElement>;
}

const buttonClasses = {
  base: 'relative min-w-13 min-h-13 w-fit py-1 px-2 text-white text-lg font-mono font-bold uppercase tracking-wider border-2 rounded-none flex items-center justify-center transition-all duration-300 overflow-visible cursor-pointer touch-none select-none',
  baseLightOff:
    'bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 border-white shadow-[0_0_20px_rgba(0,255,255,0.6)]',
  baseLightOn:
    'bg-gradient-to-r from-cyan-400/70 via-purple-400/70 to-pink-400/70 border-cyan-200 shadow-[0_0_30px_rgba(0,255,255,0.8),0_0_20px_rgba(255,0,255,0.6),inset_0_0_15px_rgba(255,255,255,0.3)]',
  fullWidth: 'w-full',
  activeOn: 'scale-95 shadow-inner',
  focus:
    'focus-visible:outline-none focus-visible:border-cyan-300 focus-visible:shadow-[0_0_0_2px_rgba(0,255,255,0.8),0_0_40px_rgba(0,255,255,0.6)]',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale',
} as const;

const ControlButton: FC<ControlButtonProps> = ({
  isToggleOn = false,
  fullWidth = false,
  label,
  icon,
  'aria-label': ariaLabel,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  ref,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseUp?.(e);
  };

  const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    onTouchStart?.(e);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onTouchEnd?.(e);
  };

  const handleTouchCancel = (e: TouchEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onTouchCancel?.(e);
  };

  return (
    <button
      className={cn(
        buttonClasses.base,
        isToggleOn ? buttonClasses.baseLightOn : buttonClasses.baseLightOff,
        fullWidth ? buttonClasses.fullWidth : '',
        isPressed ? buttonClasses.activeOn : '',
        buttonClasses.focus,
        buttonClasses.disabled,
        'group'
      )}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      ref={ref}
    >
      <div
        className={cn(
          'absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-500 transition-opacity duration-150',
          isPressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <div
        className={cn(
          'absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-500 transition-opacity duration-150',
          isPressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <div
        className={cn(
          'absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-500 transition-opacity duration-150',
          isPressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <div
        className={cn(
          'absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-500 transition-opacity duration-150',
          isPressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />

      <div className="flex items-center justify-center w-full h-full">
        {icon && (
          <span className={cn('drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]')}>
            {icon}
          </span>
        )}
        {label && (
          <span className={cn('drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]')}>
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

ControlButton.displayName;

export default ControlButton;
