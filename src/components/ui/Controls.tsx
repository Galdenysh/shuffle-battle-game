'use client';

import React, { useRef } from 'react';
import type { FC } from 'react';
import ControlButton from './ControlButton';
import ArrowIcons from './ArrowIcons';
import { BASE_HEIGHT, BASE_WIDTH } from '@/game/constants';
import { cn } from '@/lib/utils';
import { Abilities, ControlMode, Direction } from '@/types';

interface ControlsProps {
  isVisible: boolean;
  isStopMode: boolean;
  onModeChange: (isStopMode: boolean) => void;
  handleMovePress: (moveName: Direction, isActive: boolean) => void;
  handleAbilityPress: (abilityName: Abilities, isActive: boolean) => void;
  handleModePress: (mode: ControlMode) => void;
}

const containerClasses = {
  base: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100 flex items-end justify-between p-2 outline outline-2 outline-purple-500/30 outline-offset-2 transition-opacity duration-1200',
  visible: 'opacity-100 pointer-events-auto',
  hidden: 'opacity-0 pointer-events-none',
} as const;

const movesClasses = {
  base: 'grid grid-cols-3 grid-rows-3 gap-3',
} as const;

const abilitiesClasses = {
  base: 'flex flex-col gap-3',
} as const;

const Controls: FC<ControlsProps> = ({
  isVisible,
  isStopMode,
  onModeChange,
  handleMovePress,
  handleAbilityPress,
  handleModePress,
}) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moves: Array<{
    id: Direction | 'center';
    label: string;
  }> = [
    { id: Direction.NORTH_WEST, label: 'North West' },
    { id: Direction.NORTH, label: 'North' },
    { id: Direction.NORTH_EAST, label: 'North East' },
    { id: Direction.WEST, label: 'West' },
    { id: 'center', label: 'Center' },
    { id: Direction.EAST, label: 'East' },
    { id: Direction.SOUTH_WEST, label: 'South West' },
    { id: Direction.SOUTH, label: 'South' },
    { id: Direction.SOUTH_EAST, label: 'South East' },
  ];

  const abilities: Array<{
    id: Abilities;
    label: string;
  }> = [
    { id: Abilities.RUNNING_MAN, label: 'RM' },
    { id: Abilities.T_STEP_LEFT, label: 'T(L)' },
    { id: Abilities.T_STEP_RIGHT, label: 'T(R)' },
  ];

  const handleMove = (moveName: Direction | 'center', isActive: boolean) => {
    if (moveName !== 'center') {
      handleMovePress(moveName, isActive);
    } else if (isActive) {
      const isNewAbilityMode = !isStopMode;

      onModeChange(isNewAbilityMode);

      handleModePress(
        isNewAbilityMode ? ControlMode.STOP_MODE : ControlMode.MOVE_MODE
      );
    }
  };

  return (
    <div
      className={cn(
        containerClasses.base,
        isVisible ? containerClasses.visible : containerClasses.hidden
      )}
      style={{ width: `${BASE_WIDTH}px`, height: `${BASE_HEIGHT}px` }}
    >
      <div className={cn(movesClasses.base)}>
        {moves.map((move, index) => {
          const isCenter = move.id === 'center';
          const moveDirection =
            move.id !== 'center' ? move.id : Direction.NORTH;

          return (
            <ControlButton
              key={move.label}
              isToggleOn={isCenter ? isStopMode : undefined}
              icon={
                <ArrowIcons
                  direction={moveDirection}
                  isToggleOn={isStopMode}
                  showToggleIcon={isCenter}
                />
              }
              aria-label={move.label}
              onMouseDown={() => handleMove(move.id, true)}
              onMouseUp={() => handleMove(move.id, false)}
              onTouchStart={() => handleMove(move.id, true)}
              onTouchEnd={() => handleMove(move.id, false)}
              onTouchCancel={() => handleMove(move.id, false)}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
            />
          );
        })}
      </div>
      <div className={cn(abilitiesClasses.base)}>
        {abilities.map((ability, index) => (
          <ControlButton
            key={ability.label}
            label={ability.label}
            onMouseDown={() => handleAbilityPress(ability.id, true)}
            onMouseUp={() => handleAbilityPress(ability.id, false)}
            onTouchStart={() => handleAbilityPress(ability.id, true)}
            onTouchEnd={() => handleAbilityPress(ability.id, false)}
            onTouchCancel={() => handleAbilityPress(ability.id, false)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
};

Controls.displayName = 'Controls';

export default Controls;
