'use client';

import React, { useRef } from 'react';
import type { FC } from 'react';

// import './ControlButtons.css';

interface ControlButtonsProps {
  isVisible: boolean;
  handleMovePress: (moveName: string) => void;
  handleAbilityPress: (abilityName: string) => void;
}

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
      className={`dance-buttons-container ${isVisible ? 'visible' : 'hidden'}`}
    >
      {abilities.map((ability, index) => (
        <button
          key={ability.id}
          className="dance-button"
          onClick={(e) => {
            e.preventDefault();
            handleAbilityPress(ability.id);
          }}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
        >
          <span className="button-icon">{ability.icon}</span>
          <span className="button-label">{ability.label}</span>
        </button>
      ))}
    </div>
  );
};
