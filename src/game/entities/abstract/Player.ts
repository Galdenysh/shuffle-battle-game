import { Physics } from 'phaser';
import type { Scene } from 'phaser';
import type { AnimationConfig, PlayerConfig } from '../types';

export abstract class Player extends Physics.Arcade.Sprite {
  protected config: PlayerConfig;

  constructor(scene: Scene, x: number, y: number, config: PlayerConfig) {
    super(scene, x, y, config.textureKey);

    this.config = config;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(config.scale || 1);
    this.setOrigin(0.5, 0.5);
    this.setupPhysics();
    this.setupAnimations();
    this.play(config.defaultAnimation);
  }

  protected addAnimation(config: AnimationConfig): void {
    this.scene.anims.create({
      key: config.key,
      frames: this.scene.anims.generateFrameNames(this.config.textureKey, {
        prefix: config.prefix,
        start: config.start,
        end: config.end,
        zeroPad: config.zeroPad,
        suffix: config.suffix || '.png',
      }),
      frameRate: config.frameRate,
      repeat: config.repeat ?? -1,
      yoyo: config.yoyo ?? false,
    });
  }

  protected setupPhysics(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const width = this.width * this.config.colliderScaleX;
    const height = this.height * this.config.colliderScaleY;

    body.setSize(width, height, true);
    body.setCollideWorldBounds(this.config.collideWorldBounds);
    body.setMaxVelocity(this.config.maxVelocity);
    body.setDrag(this.config.drag);
  }

  protected abstract setupAnimations(): void;
}
