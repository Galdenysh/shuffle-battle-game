'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { ControlButtons } from '@/components/ui';
import { EMIT_EVENT } from '@/game/constants';
import { EventBus } from '@/game/core';

export const GameButtons: FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleAbilityPress = (abilityName: string) => {
    EventBus.emit(EMIT_EVENT.ABILITY_TRIGGERED, abilityName);
  };

  // Обработка scene-visible
  useEffect(() => {
    EventBus.once(EMIT_EVENT.SCENE_VISIBLE, () => {
      setVisible(true);
    });
  }, []);

  return (
    <ControlButtons
      isVisible={visible}
      handleMovePress={() => {}}
      handleAbilityPress={handleAbilityPress}
    />
  );
};
