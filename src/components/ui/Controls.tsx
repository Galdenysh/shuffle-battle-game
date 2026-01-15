'use client';


import type { FC } from 'react';
import ControlButton from './ControlButton';
import ArrowIcons from './ArrowIcons';
import { cn } from '@/lib/utils';
import { Abilities, ControlMode, Direction } from '@/types';

interface ControlsProps {
  isStopMode: boolean;
  onModeChange: (isStopMode: boolean) => void;
  handleMovePress: (moveName: Direction, isActive: boolean) => void;
  handleAbilityPress: (abilityName: Abilities, isActive: boolean) => void;
  handleModePress: (mode: ControlMode) => void;
}

const movesClasses = {
  base: 'grid grid-cols-3 grid-rows-3 gap-4',
} as const;

const abilitiesClasses = {
  base: 'flex flex-col gap-4',
} as const;

const Controls: FC<ControlsProps> = ({
  isStopMode,
  onModeChange,
  handleMovePress,
  handleAbilityPress,
  handleModePress,
}) => {
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
    <div className={cn('flex justify-between w-full')}>
      <div className={cn(movesClasses.base)}>
        {moves.map((move) => {
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
            />
          );
        })}
      </div>
      <div className={cn(abilitiesClasses.base)}>
        {abilities.map((ability) => (
          <ControlButton
            key={ability.label}
            label={ability.label}
            fullWidth
            onMouseDown={() => handleAbilityPress(ability.id, true)}
            onMouseUp={() => handleAbilityPress(ability.id, false)}
            onTouchStart={() => handleAbilityPress(ability.id, true)}
            onTouchEnd={() => handleAbilityPress(ability.id, false)}
            onTouchCancel={() => handleAbilityPress(ability.id, false)}
          />
        ))}
      </div>
    </div>
  );
};

Controls.displayName = 'Controls';

export default Controls;
