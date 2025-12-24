export type Direction =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'north_east'
  | 'north_west'
  | 'south_east'
  | 'south_west';

export type CharacterType = 'netrunner' | 'hoodie';

export interface PlayerConfig {
  textureKey: string;
  scale: number;
  defaultAnimation: string;
  colliderScaleX: number;
  colliderScaleY: number;
  maxVelocity: number;
  collideWorldBounds: boolean;
  drag: number;
}

export interface AnimationConfig {
  key: string;
  prefix: string;
  start: number;
  end: number;
  zeroPad: number;
  frameRate: number;
  repeat?: number;
  suffix?: string;
  yoyo?: boolean;
}

export interface FactoryCharacterConfig {
  type: CharacterType;
  x: number;
  y: number;
  custom?: Partial<PlayerConfig>;
}
