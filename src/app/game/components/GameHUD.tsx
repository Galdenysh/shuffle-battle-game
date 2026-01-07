'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowIcons,
  ControlButton,
  Controls,
  ScoreDisplay,
} from '@/components/ui';
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

interface GameHUDProps {
  isVisibleGamepad?: boolean;
}

const containerClasses = {
  base: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100 flex flex-col justify-between p-2 outline outline-2 outline-purple-500/30 outline-offset-2 transition-opacity duration-1200',
  visible: 'opacity-100 pointer-events-auto',
  hidden: 'opacity-0 pointer-events-none',
} as const;

const GameHUD: FC<GameHUDProps> = ({ isVisibleGamepad = true }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isStopMode, setIsStopMode] = useState<boolean>(false);

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
    setIsStopMode(newIsAbilityMode);
  };

  const handleMode = () => {
    const isNewAbilityMode = !isStopMode;

    handleAbilityMode(isNewAbilityMode);

    handleModePress(
      isNewAbilityMode ? ControlMode.STOP_MODE : ControlMode.MOVE_MODE
    );
  };

  // Синхронизация с touch кнопкой
  useEffect(() => {
    const handleModeTriggered = ({
      mode,
    }: ControlModeTriggeredEvent['data']) => {
      setIsStopMode(mode === ControlMode.STOP_MODE);
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
      <AnimatePresence mode="wait" initial={false}>
        {!isVisibleGamepad ? (
          <motion.div
            key="control-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: 'tween',
              ease: 'easeInOut',
              duration: 0.2,
            }}
          >
            <ControlButton
              isToggleOn={isStopMode}
              icon={
                <ArrowIcons isToggleOn={isStopMode} showToggleIcon={true} />
              }
              aria-label="Center"
              onMouseDown={handleMode}
              onTouchStart={handleMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="gamepad"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: 'tween',
              ease: 'easeInOut',
              duration: 0.2,
            }}
          >
            <Controls
              isStopMode={isStopMode}
              onModeChange={handleAbilityMode}
              handleMovePress={handleMovePress}
              handleAbilityPress={handleAbilityPress}
              handleModePress={handleModePress}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

GameHUD.displayName = 'GameHUD';

export default GameHUD;
