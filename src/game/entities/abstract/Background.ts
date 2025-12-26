import { GameObjects, Scene, Tilemaps } from 'phaser';
import type { AnimationConfig, BackgroundConfig, TileConfig } from '../types';

export abstract class Background extends GameObjects.Sprite {
  protected config: BackgroundConfig;
  protected defaultScene: Scene;

  constructor(scene: Scene, x: number, y: number, config: BackgroundConfig) {
    super(scene, x, y, config.textureKey);

    this.config = config;
    this.defaultScene = scene;

    const scaleX = scene.cameras.main.width / this.width;
    const scaleY = scene.cameras.main.height / this.height;
    const scale = Math.max(scaleX, scaleY);

    this.setScale(scale);
    this.setPosition(scene.cameras.main.centerX, scene.cameras.main.centerY);

    scene.add.existing(this);

    this.setupAnimations();
    this.setupPhysic();
    this.play(config.animationKey);
  }

  protected addAnimation(config: AnimationConfig): void {
    this.scene.anims.create({
      key: config.key,
      frames: this.scene.anims.generateFrameNumbers(this.config.textureKey, {
        start: config.start,
        end: config.end,
      }),
      frameRate: config.frameRate,
      repeat: config.repeat ?? -1,
      yoyo: config.yoyo ?? false,
    });
  }

  protected addTileset(config: TileConfig): {
    map: Tilemaps.Tilemap;
    tileset: Tilemaps.Tileset | null;
  } {
    const map = this.defaultScene.make.tilemap({ key: config.tilemapKey });
    const tileset = map.addTilesetImage(config.tilesetName, config.tilesetKey);

    return { map, tileset };
  }

  protected abstract setupAnimations(): void;

  protected abstract setupPhysic(): void;
}
