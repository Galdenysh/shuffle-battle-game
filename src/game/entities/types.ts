export enum Direction {
  NORTH = 'north',
  NORTH_EAST = 'north_east',
  EAST = 'east',
  SOUTH_EAST = 'south_east',
  SOUTH = 'south',
  SOUTH_WEST = 'south_west',
  WEST = 'west',
  NORTH_WEST = 'north_west',
}

export type CharacterType = 'netrunner_woman' | 'nomadmechanic_man';

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
}
