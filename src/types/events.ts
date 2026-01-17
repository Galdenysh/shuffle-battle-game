import type { Scene } from 'phaser';
import type { Direction } from './direction';
import type { Abilities, ControlMode } from './abilities';
import type { GameCommand, GameState } from './gameState';

export enum EmitEvents {
  // Scene Events
  SCENE_VISIBLE = 'scene-visible',
  CURRENT_SCENE_READY = 'current-scene-ready',

  // Control Events
  MOVE_TRIGGERED = 'move-triggered',
  ABILITY_TRIGGERED = 'ability-triggered',
  CONTROL_MODE_TRIGGERED = 'control-mode-triggered',
  RESTART_TRIGGERED = 'restart-triggered',

  // Gameplay Events
  SCORE_CHANGED = 'score-changed',
  TIME_CHANGED = 'time-changed',
  GAME_STATE_CHANGED = 'game-state-changed',
  LEVEL_COMPLETED_ACTION = 'level-complete-action',
}

export interface SceneVisibleEvent {
  type: EmitEvents.SCENE_VISIBLE;
  payload: {
    isVisible: boolean;
  };
  timestamp?: number;
}

export interface CurrentSceneReadyEvent {
  type: EmitEvents.CURRENT_SCENE_READY;
  payload: {
    scene: Scene;
  };
  timestamp?: number;
}

export interface MoveTriggeredEvent {
  type: EmitEvents.MOVE_TRIGGERED;
  payload: {
    moveName: Direction;
    isActive: boolean;
  };
  timestamp?: number;
}

export interface AbilityTriggeredEvent {
  type: EmitEvents.ABILITY_TRIGGERED;
  payload: {
    abilityName: Abilities;
    isActive: boolean;
  };
  timestamp?: number;
}

export interface ControlModeTriggeredEvent {
  type: EmitEvents.CONTROL_MODE_TRIGGERED;
  payload: {
    mode: ControlMode;
  };
  timestamp?: number;
}

export interface ScoreChangedEvent {
  type: EmitEvents.SCORE_CHANGED;
  payload: {
    deltaScore: number;
    totalScore: number;
    comboChain: number;
  };
  timestamp?: number;
}

export interface TimeChangedEvent {
  type: EmitEvents.TIME_CHANGED;
  payload: {
    timeLeft: number;
    isWarning: boolean;
    isCritical: boolean;
    isTimeUp: boolean;
  };
  timestamp?: number;
}

export interface GameStateChangedEvent {
  type: EmitEvents.GAME_STATE_CHANGED;
  payload: {
    previous: GameState;
    current: GameState;
  };
  timestamp?: number;
}

export interface LevelCompleteActionEvent {
  type: EmitEvents.LEVEL_COMPLETED_ACTION;
  payload: {
    action: GameCommand;
  };
  timestamp?: number;
}

export type GameEvent =
  | SceneVisibleEvent
  | CurrentSceneReadyEvent
  | MoveTriggeredEvent
  | AbilityTriggeredEvent
  | ControlModeTriggeredEvent
  | ScoreChangedEvent
  | TimeChangedEvent
  | GameStateChangedEvent
  | LevelCompleteActionEvent;
