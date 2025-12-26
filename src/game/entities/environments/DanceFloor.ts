import type { Scene, Tilemaps } from 'phaser';
import { Background } from '../abstract';
import { BackgroundConfig } from '../types';
import { BACKGROUND_ANIMATION_DEFAULTS } from '../constants';

export class DanceFloor extends Background {
  private static readonly DEFAULT_CONFIG: BackgroundConfig = {
    textureKey: 'background_anim',
    animationKey: 'dance_floor_anim',
    tilemapKey: 'collision_map',
    tilesetKey: 'collision_tiles',
    tilesetName: 'tileset',
  };

  private wallsLayer: Tilemaps.TilemapLayer | null;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    customConfig?: Partial<BackgroundConfig>
  ) {
    super(scene, x, y, { ...DanceFloor.DEFAULT_CONFIG, ...customConfig });
  }

  public getConfig(): BackgroundConfig {
    return { ...this.config };
  }

  public getWallsLayer(): Tilemaps.TilemapLayer | null {
    return this.wallsLayer;
  }

  protected setupAnimations(): void {
    this.addAnimation({
      key: this.config.animationKey,
      start: 0,
      end: 48,
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
      console.warn(`⚠️ Tileset не инициализирован в ${this.constructor.name}`);

      return;
    }

    this.wallsLayer = map.createLayer('walls', tileset, 0, 0);

    if (!this.wallsLayer) {
      console.warn(
        `⚠️ Walls Layer не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    this.wallsLayer.setAlpha(0);
    this.wallsLayer.setCollisionByProperty({ collides: true });
  }
}
