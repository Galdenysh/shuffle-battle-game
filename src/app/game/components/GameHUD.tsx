'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowIcons,
  ControlButton,
  Controls,
  LevelControls,
  ScoreDisplay,
} from '@/components/ui';
import { BASE_HEIGHT, BASE_WIDTH } from '@/game/constants';
import { EventBus } from '@/game/core';
import {
  Abilities,
  ControlMode,
  Direction,
  GameCommand,
  GameState,
  TimeChangedEvent,
} from '@/types';
import { cn } from '@/lib/utils';
import {
  ControlModeTriggeredEvent,
  EmitEvents,
  SceneVisibleEvent,
  ScoreChangedEvent,
} from '@/types';

interface GameHUDProps {
  isVisibleGamepad?: boolean;
}

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

  const [timerData, setTimerData] = useState<{
    timeLeft: number;
    isWarning: boolean;
    isCritical: boolean;
    isTimeUp: boolean;
    timestamp: number;
  }>({
    timeLeft: 0,
    isWarning: false,
    isCritical: false,
    isTimeUp: false,
    timestamp: 0,
  });

  const [gameState, setGameState] = useState<GameState | null>(null);

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

  const handleRestart = () => {
    EventBus.emit(EmitEvents.LEVEL_COMPLETED_ACTION, {
      action: GameCommand.RESTART,
    });

    setIsStopMode(false); // Сброс touch кнопки
  };

  // Синхронизация с touch кнопкой
  useEffect(() => {
    const handleModeTriggered = ({
      mode,
    }: ControlModeTriggeredEvent['payload']) => {
      setIsStopMode(mode === ControlMode.STOP_MODE);
    };

    EventBus.on(EmitEvents.CONTROL_MODE_TRIGGERED, handleModeTriggered);

    return () => {
      EventBus.off(EmitEvents.CONTROL_MODE_TRIGGERED, handleModeTriggered);
    };
  }, []);

  // Обработка scene-visible
  useEffect(() => {
    const handleVisible = ({ isVisible }: SceneVisibleEvent['payload']) => {
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
      { deltaScore, totalScore, comboChain }: ScoreChangedEvent['payload'],
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

  // Обработка time-changed
  useEffect(() => {
    const handleTimer = (
      {
        timeLeft,
        isWarning,
        isCritical,
        isTimeUp,
      }: TimeChangedEvent['payload'],
      timestamp?: number
    ) => {
      setTimerData({
        timeLeft,
        isWarning,
        isCritical,
        isTimeUp,
        timestamp: timestamp ?? 0,
      });
    };

    EventBus.on(EmitEvents.TIME_CHANGED, handleTimer);

    return () => {
      EventBus.off(EmitEvents.TIME_CHANGED, handleTimer);
    };
  }, []);

  // Обработка game-state-changed
  useEffect(() => {
    EventBus.on(EmitEvents.GAME_STATE_CHANGED, ({ current }) => {
      setGameState(current);
    });
  }, []);

  return (
    <motion.div
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 flex flex-col justify-between p-2'
      )}
      style={{
        // Это гарантирует 100% совпадение с Phaser Scale.FIT
        width: `min(100dvw, calc(100dvh * (${BASE_WIDTH} / ${BASE_HEIGHT})))`,
        height: `min(100dvh, calc(100dvw * (${BASE_HEIGHT} / ${BASE_WIDTH})))`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      transition={{ duration: 0.5 }}
    >
      <ScoreDisplay
        totalScore={scoreData.totalScore}
        deltaScore={scoreData.deltaScore}
        comboChain={scoreData.comboChain}
        timestampScore={scoreData.timestamp}
        timeLeft={timerData.timeLeft}
        isWarning={timerData.isWarning}
        isCritical={timerData.isCritical}
        isTimeUp={timerData.isTimeUp}
        timestampTimer={timerData.timestamp}
      />
      <LevelControls
        gameState={gameState ?? undefined}
        onRestart={handleRestart}
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
    </motion.div>
  );
};

GameHUD.displayName = 'GameHUD';

export default GameHUD;
