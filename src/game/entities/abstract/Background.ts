import { GameObjects, Scene } from 'phaser';
import type { AnimationConfig, BackgroundConfig } from '../types';

export abstract class Background extends GameObjects.Sprite {
  protected config: BackgroundConfig;

  constructor(scene: Scene, x: number, y: number, config: BackgroundConfig) {
    super(scene, x, y, config.textureKey);

    this.config = config;

    scene.add.existing(this);

    const scaleX = scene.cameras.main.width / this.width;
    const scaleY = scene.cameras.main.height / this.height;
    const scale = Math.max(scaleX, scaleY);

    this.setScale(scale);
    this.setPosition(scene.cameras.main.centerX, scene.cameras.main.centerY);
    this.setupAnimations();
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

  protected abstract setupAnimations(): void;
}
