import React, { useEffect, useRef } from 'react';
// import './ControlButtons.css';

interface ControlButtonsProps {
  onMove: (moveName: string) => void;
  isVisible: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onMove,
  isVisible,
}) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moves = [
    { id: 'running-man', icon: '🔥', label: 'Running Man' },
    { id: 't-step-left', icon: '👈', label: 'T-Step Left' },
    { id: 't-step-right', icon: '👉', label: 'T-Step Right' },
    { id: 'spin', icon: '🔄', label: 'Spin' },
    { id: 'jump', icon: '⬆️', label: 'Jump' },
  ];

  useEffect(() => {
    buttonRefs.current.forEach((btn) => {
      if (!btn) return;

      const handleStart = (e: TouchEvent | Event) => {
        e.preventDefault();

        const moveId = btn.dataset.move;

        if (moveId) onMove(moveId);

        btn.classList.add('active');
      };

      btn.addEventListener('touchstart', handleStart, { passive: false });
      btn.addEventListener('click', handleStart);

      return () => {
        btn.removeEventListener('touchstart', handleStart);
        btn.removeEventListener('click', handleStart);
      };
    });
  }, [onMove]);

  return (
    <div
      className={`dance-buttons-container ${isVisible ? 'visible' : 'hidden'}`}
    >
      {moves.map((move, index) => (
        <button
          key={move.id}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          data-move={move.id}
          className="dance-button"
        >
          <span className="button-icon">{move.icon}</span>
          <span className="button-label">{move.label}</span>
        </button>
      ))}
    </div>
  );
};
