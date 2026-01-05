'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Controls, ScoreDisplay } from '@/components/ui';
import { BASE_HEIGHT, BASE_WIDTH } from '@/game/constants';
import { EventBus } from '@/game/core';
import { Abilities, ControlMode, Direction } from '@/types';
import { cn } from '@/lib/utils';
import {
  ControlModeTriggeredEvent,
  EmitEvents,
  SceneVisibleEvent,
  ScoreChangedEvent,
} from '@/types/events';

const containerClasses = {
  base: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100 flex flex-col justify-between p-2 outline outline-2 outline-purple-500/30 outline-offset-2 transition-opacity duration-1200',
  visible: 'opacity-100 pointer-events-auto',
  hidden: 'opacity-0 pointer-events-none',
} as const;

const GameHUD: FC<{ onReady?: (ready: boolean) => void }> = ({ onReady }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isStopMode, setIsAbilityMode] = useState<boolean>(false);

  const [scoreData, setScoreData] = useState<{
    totalScore: number;
    comboChain: number;
    deltaScore: number | null;
    timestamp: number;
  }>({
    totalScore: 0,
    comboChain: 1,
    deltaScore: null,
    timestamp: 0,
  });

  const handleMovePress = (moveName: Direction, isActive: boolean) => {
    EventBus.emit(EmitEvents.MOVE_TRIGGERED, { moveName, isActive });
  };

  const handleAbilityPress = (abilityName: Abilities, isActive: boolean) => {
    EventBus.emit(EmitEvents.ABILITY_TRIGGERED, { abilityName, isActive });
  };

  const handleModePress = (mode: ControlMode) => {
    EventBus.emit(EmitEvents.CONTROL_MODE_TRIGGERED, { mode });
  };

  const handleAbilityMode = (newIsAbilityMode: boolean) => {
    setIsAbilityMode(newIsAbilityMode);
  };

  // Синхронизация с touch кнопкой
  useEffect(() => {
    const handleModeTriggered = ({
      mode,
    }: ControlModeTriggeredEvent['data']) => {
      setIsAbilityMode(mode === ControlMode.STOP_MODE);
    };

    EventBus.on(EmitEvents.CONTROL_MODE_TRIGGERED, handleModeTriggered);

    return () => {
      EventBus.off(EmitEvents.CONTROL_MODE_TRIGGERED, handleModeTriggered);
    };
  }, []);

  // Обработка scene-visible
  useEffect(() => {
    const handleVisible = ({ isVisible }: SceneVisibleEvent['data']) => {
      setIsVisible(isVisible);
    };

    EventBus.once(EmitEvents.SCENE_VISIBLE, handleVisible);

    return () => {
      EventBus.off(EmitEvents.SCENE_VISIBLE, handleVisible);
    };
  }, []);

  // Обработка score-changed
  useEffect(() => {
    const handleScore = (
      { deltaScore, totalScore, comboChain }: ScoreChangedEvent['data'],
      timestamp?: number
    ) => {
      setScoreData({
        totalScore,
        comboChain,
        deltaScore,
        timestamp: timestamp ?? 0,
      });
    };

    EventBus.on(EmitEvents.SCORE_CHANGED, handleScore);

    return () => {
      EventBus.off(EmitEvents.SCORE_CHANGED, handleScore);
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
    <div
      className={cn(
        containerClasses.base,
        isVisible ? containerClasses.visible : containerClasses.hidden
      )}
      style={{ width: `${BASE_WIDTH}px`, height: `${BASE_HEIGHT}px` }}
    >
      <ScoreDisplay
        totalScore={scoreData.totalScore}
        deltaScore={scoreData.deltaScore}
        comboChain={scoreData.comboChain}
        timestamp={scoreData.timestamp}
      />
      <Controls
        isStopMode={isStopMode}
        onModeChange={handleAbilityMode}
        handleMovePress={handleMovePress}
        handleAbilityPress={handleAbilityPress}
        handleModePress={handleModePress}
      />
    </div>
  );
};

GameHUD.displayName = 'GameHUD';

export default GameHUD;
