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
  defaultAnimationKey: string;
  scale: number;
  colliderScaleX: number;
  colliderScaleY: number;
  maxVelocity: number;
  collideWorldBounds: boolean;
  drag: number;
}

export interface BackgroundConfig {
  textureKey: string;
  animationKey: string;
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
