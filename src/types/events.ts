import type { Scene } from 'phaser';
import type { Direction } from './direction';
import { Abilities, ControlMode } from './abilities';

export enum EmitEvents {
  SCENE_VISIBLE = 'scene-visible',
  CURRENT_SCENE_READY = 'current-scene-ready',
  MOVE_TRIGGERED = 'move-triggered',
  ABILITY_TRIGGERED = 'ability-triggered',
  CONTROL_MODE_TRIGGERED = 'control-mode-triggered',
  SCORE_CHANGED = 'score-changed',
}

export interface SceneVisibleEvent {
  type: EmitEvents.SCENE_VISIBLE;
  data: {
    isVisible: boolean;
  };
  timestamp?: number;
}

export interface CurrentSceneReadyEvent {
  type: EmitEvents.CURRENT_SCENE_READY;
  data: {
    scene: Scene;
  };
  timestamp?: number;
}

export interface MoveTriggeredEvent {
  type: EmitEvents.MOVE_TRIGGERED;
  data: {
    moveName: Direction;
    isActive: boolean;
  };
  timestamp?: number;
}

export interface AbilityTriggeredEvent {
  type: EmitEvents.ABILITY_TRIGGERED;
  data: {
    abilityName: Abilities;
    isActive: boolean;
  };
  timestamp?: number;
}

export interface ControlModeTriggeredEvent {
  type: EmitEvents.CONTROL_MODE_TRIGGERED;
  data: {
    mode: ControlMode;
  };
  timestamp?: number;
}

export interface ScoreChangedEvent {
  type: EmitEvents.SCORE_CHANGED;
  data: {
    deltaScore: number;
    totalScore: number;
    comboChain: number;
  };
  timestamp?: number;
}

export type GameEvent =
  | SceneVisibleEvent
  | CurrentSceneReadyEvent
  | MoveTriggeredEvent
  | AbilityTriggeredEvent
  | ControlModeTriggeredEvent
  | ScoreChangedEvent;
