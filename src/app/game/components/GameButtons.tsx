'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Controls } from '@/components/ui';
import { EMIT_EVENT } from '@/game/constants';
import { EventBus } from '@/game/core';

const GameButtons: FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleAbilityPress = (abilityName: string) => {
    EventBus.emit(EMIT_EVENT.ABILITY_TRIGGERED, abilityName);
  };

  // Обработка scene-visible
  useEffect(() => {
    EventBus.once(EMIT_EVENT.SCENE_VISIBLE, () => {
      setVisible(true);
    });

    EventBus.ready(); // TODO: Вынести логику в page
  }, []);

  return (
    <Controls
      isVisible={visible}
      handleMovePress={() => {}}
      handleAbilityPress={handleAbilityPress}
    />
  );
};

GameButtons.displayName = 'GameButtons';

export default GameButtons;
