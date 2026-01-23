import type { Scene, Tilemaps } from 'phaser';
import { Background } from '../abstract';
import { BackgroundConfig } from '../types';
import { BACKGROUND_ANIMATION_DEFAULTS } from '../constants';
import { ASSET_KEYS } from '@/game/constants';
import logger from '@/lib/logger';

export class DanceFloor extends Background {
  private static readonly DEFAULT_CONFIG: BackgroundConfig = {
    textureSritesheetKey: ASSET_KEYS.ENV_BACKGROUND_ANIM,
    textureBackgroundKey: ASSET_KEYS.ENV_BACKGROUND,
    textureForegroundKey: ASSET_KEYS.ENV_FOREGROUND,
    animationKey: 'dance_floor_anim',
    tilemapKey: ASSET_KEYS.ENV_COLLISION_MAP,
    tilesetKey: ASSET_KEYS.ENV_COLLISION_TILES,
    tilesetName: 'tileset', // Берется из tilemap.json
    animationDepth: 0,
  };

  private wallsLayer: Tilemaps.TilemapLayer | null = null;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    customConfig?: Partial<BackgroundConfig>
  ) {
    super(scene, x, y, { ...DanceFloor.DEFAULT_CONFIG, ...customConfig });

    this.initBackground();
  }

  public getConfig(): BackgroundConfig {
    return { ...this.config };
  }

  public getWallsLayer(): Tilemaps.TilemapLayer | null {
    return this.wallsLayer;
  }

  protected setupBackground(): void {
    this.addImage(this.config.textureBackgroundKey).setDepth(-100);
  }

  protected setupForeground(): void {
    this.addImage(this.config.textureForegroundKey).setDepth(2000);
  }

  protected setupAnimations(): void {
    this.addAnimation({
      key: this.config.animationKey,
      start: 0,
      end: 23,
      ...BACKGROUND_ANIMATION_DEFAULTS,
    });
  }

  protected setupPhysic(): void {
    const { map, tileset } = this.addTileset({
      tilemapKey: this.config.tilemapKey,
      tilesetKey: this.config.tilesetKey,
      tilesetName: this.config.tilesetName,
    });

    if (!tileset) {
      logger.warn(`Tileset не инициализирован в ${this.constructor.name}`);

      return;
    }

    this.wallsLayer = map.createLayer('walls', tileset, 0, 0);

    if (!this.wallsLayer) {
      logger.warn(
        `Walls Layer не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    this.wallsLayer.setAlpha(0);
    this.wallsLayer.setCollisionByProperty({ collides: true });
  }
}
