'use client';

import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import type { FC } from 'react';

interface ControlButtonsProps {
  isVisible: boolean;
  handleMovePress: (moveName: string) => void;
  handleAbilityPress: (abilityName: string) => void;
}

const containerClasses = {
  base: 'fixed bottom-6 right-6 z-50 flex flex-col gap-4 p-4 transition-all duration-300 ease-out',
  visible: 'opacity-100 translate-y-0 pointer-events-auto',
  hidden: 'opacity-0 translate-y-10 pointer-events-none',
};

const buttonClasses = {
  base: 'relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-lg border border-white/20 shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 group overflow-hidden',
  hover:
    'hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-600/30',
  active: 'active:scale-95 active:shadow-inner',
  focus:
    'focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black/50',
  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
};

const iconClasses =
  'text-3xl transition-transform duration-300 group-hover:scale-110 group-active:scale-90';

const labelClasses =
  'text-xs font-semibold text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:bg-black/40 group-hover:text-white';

export const ControlButtons: FC<ControlButtonsProps> = ({
  isVisible,
  handleMovePress,
  handleAbilityPress,
}) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const abilities = [
    { id: 'running-man', icon: '🔥', label: 'Running Man' },
    { id: 't-step-left', icon: '👈', label: 'T-Step Left' },
    { id: 't-step-right', icon: '👉', label: 'T-Step Right' },
  ];

  return (
    <div
      className={cn(
        containerClasses.base,
        isVisible ? containerClasses.visible : containerClasses.hidden
      )}
    >
      {abilities.map((ability, index) => (
        <button
          key={ability.id}
          className={cn(
            buttonClasses.base,
            buttonClasses.hover,
            buttonClasses.active,
            buttonClasses.focus,
            buttonClasses.disabled
          )}
          onClick={(e) => {
            e.preventDefault();
            handleAbilityPress(ability.id);
          }}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
        >
          {/* <span className={iconClasses}>{ability.icon}</span> */}
          <span className={labelClasses}>{ability.label}</span>
        </button>
      ))}
    </div>
  );
};
