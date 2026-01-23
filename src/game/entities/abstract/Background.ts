import { GameObjects, Scene, Tilemaps } from 'phaser';
import type { AnimationConfig, BackgroundConfig, TileConfig } from '../types';
import logger from '@/lib/logger';

export abstract class Background extends GameObjects.Sprite {
  protected config: BackgroundConfig;
  protected defaultScene: Scene;

  private missingAnimCache = new Map<string, number>();
  private readonly CACHE_TTL = 5000;

  constructor(scene: Scene, x: number, y: number, config: BackgroundConfig) {
    super(scene, x, y, config.textureSritesheetKey);

    this.config = config;
    this.defaultScene = scene;

    const scaleX = scene.cameras.main.width / this.width;
    const scaleY = scene.cameras.main.height / this.height;
    const scale = Math.max(scaleX, scaleY);

    this.setScale(scale);
    this.setPosition(scene.cameras.main.centerX, scene.cameras.main.centerY);

    scene.add.existing(this);
  }

  protected addImage(textureKey: string): GameObjects.Image {
    return this.scene.add.image(0, 0, textureKey).setOrigin(0, 0);
  }

  protected addAnimation(config: AnimationConfig): void {
    if (
      this.scene.anims.exists(
        `${this.config.textureSritesheetKey}_${config.key}`
      )
    ) {
      return;
    }

    this.scene.anims.create({
      key: `${this.config.textureSritesheetKey}_${config.key}`,
      frames: this.scene.anims.generateFrameNumbers(
        this.config.textureSritesheetKey,
        {
          start: config.start,
          end: config.end,
        }
      ),
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

  protected setupForeground(): void {}

  protected abstract setupBackground(): void;

  protected abstract setupAnimations(): void;

  protected abstract setupPhysic(): void;

  protected initBackground() {
    this.setupBackground();
    this.setupForeground();
    this.setupAnimations();
    this.setDepth(this.config.animationDepth);
    this.setupPhysic();

    this.playSafe(
      `${this.config.textureSritesheetKey}_${this.config.animationKey}`,
      true
    );
  }

  private playSafe(key: string, ignoreIfPlaying?: boolean): void {
    const cachedTime = this.missingAnimCache.get(key);

    if (cachedTime !== undefined) {
      if (Date.now() - cachedTime < this.CACHE_TTL) {
        this.anims.stop();

        return;
      }

      this.missingAnimCache.delete(key);
    }

    if (!this.scene.anims.exists(key)) {
      if (cachedTime === undefined) {
        logger.warn(
          `Анимация ${key} не обнаружена для ${this.constructor.name}`
        );
      }

      this.missingAnimCache.set(key, Date.now());
      this.anims.stop();

      return;
    }

    this.play(key, ignoreIfPlaying);
  }
}
