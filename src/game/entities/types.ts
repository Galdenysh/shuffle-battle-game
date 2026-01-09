import type { Abilities, Direction } from '@/types';

export type CharacterType = 'mc_man' | 'shuffler_man';

interface PlayerVisualConfig {
  textureKey: string;
  defaultDirection: Direction;
  scale: number;
}

interface PlayerPhysicConfig {
  colliderScaleX: number;
  colliderScaleY: number;
  colliderOffsetX: number;
  colliderOffsetY: number;
  maxVelocity: number;
  collideWorldBounds: boolean;
  pushable: boolean;
  drag: number;
}

interface PlayerStatsConfig {
  speedWalking: number;
}

export interface PlayerConfig
  extends PlayerVisualConfig,
    PlayerPhysicConfig,
    PlayerStatsConfig {}

export interface TileConfig {
  tilemapKey: string;
  tilesetKey: string;
  tilesetName: string;
}

export interface BackgroundConfig {
  textureSritesheetKey: string;
  textureBackgroundKey: string;
  textureForegroundKey: string;
  animationKey: string;
  tilemapKey: TileConfig['tilemapKey'];
  tilesetKey: TileConfig['tilesetKey'];
  tilesetName: TileConfig['tilesetName'];
  animationDepth: number;
}

export interface AnimationConfig {
  key: string;
  start: number;
  end: number;
  frameRate: number;
  prefix?: string;
  zeroPad?: number;
  suffix?: string;
  repeat?: number;
  yoyo?: boolean;
}

export interface FactoryCharacterConfig {
  type: CharacterType;
  x: number;
  y: number;
  custom?: Partial<PlayerConfig>;
}

export type WASDKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export enum ControlScheme {
  ARROWS = 'arrows',
  WASD = 'wasd',
  BOTH = 'both',
  TOUCH = 'touch',
  ALL = 'all',
}

export interface AbilityRecord {
  ability: Abilities;
  timestamp: number;
  direction: Direction;
}

export interface Combo {
  id: string;
  name: string;
  pattern: Abilities[];
  baseScore: number;
  difficulty: number;
  timeLimit: number;
  multiplier?: number;
  description?: string;
}

export interface ComboScorePayload {
  combo: Combo;
  points: number;
  comboChain: number;
  records: AbilityRecord[];
  timestamp: number;
}
