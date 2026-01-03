'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Controls } from '@/components/ui';
import { EMIT_EVENT } from '@/game/constants';
import { EventBus } from '@/game/core';
import { Abilities, ControlMode, Direction } from '@/types';

const GameButtons: FC<{ onReady?: (ready: boolean) => void }> = ({
  onReady,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleMovePress = (moveName: Direction, isActive: boolean) => {
    EventBus.emit(EMIT_EVENT.MOVE_TRIGGERED, moveName, isActive);
  };

  const handleAbilityPress = (abilityName: Abilities, isActive: boolean) => {
    EventBus.emit(EMIT_EVENT.ABILITY_TRIGGERED, abilityName, isActive);
  };

  const handleModePress = (mode: ControlMode) => {
    EventBus.emit(EMIT_EVENT.CONTROL_MODE_TRIGGERED, mode);
  };

  // Обработка scene-visible
  useEffect(() => {
    const handleVisible = () => {
      setVisible(true);
    };

    EventBus.once(EMIT_EVENT.SCENE_VISIBLE, handleVisible);

    return () => {
      EventBus.off(EMIT_EVENT.SCENE_VISIBLE, handleVisible);
    };
  }, []);

  useEffect(() => {
    let rafId1: number;
    let rafId2: number;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        onReady?.(true);
      });
    });

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);

      onReady?.(false);
    };
  }, [onReady]);

  return (
    <Controls
      isVisible={visible}
      handleMovePress={handleMovePress}
      handleAbilityPress={handleAbilityPress}
      handleModePress={handleModePress}
    />
  );
};

GameButtons.displayName = 'GameButtons';

export default GameButtons;
