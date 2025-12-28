import { Physics } from 'phaser';
import type { Scene } from 'phaser';
import { Direction } from '../types';
import type { AnimationConfig, PlayerConfig } from '../types';
import { CHARACTER_ANIMATION_DEFAULTS } from '../constants';

export abstract class Player extends Physics.Arcade.Sprite {
  protected config: PlayerConfig;
  protected currentDirection: Direction;
  protected lastDepthY: number;

  private missingAnimCache = new Map<string, number>();
  private readonly CACHE_TTL = 5000;

  constructor(scene: Scene, x: number, y: number, config: PlayerConfig) {
    super(scene, x, y, config.textureKey);

    this.config = config;
    this.currentDirection = config.defaultDirection;
    this.lastDepthY = this.y;

    this.setScale(config.scale || 1);
    this.setOrigin(0.5, 0.5);
    this.setDepth(this.y);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setupIdleAnimations();
    this.setupWalkAnimations();
    this.setupRunningManStepAnimations();
    this.setupPhysics();
    this.playIdleAnimation();
  }

  public updateDepth(): void {
    const currentY = Math.floor(this.y);

    if (currentY !== this.lastDepthY) {
      this.setDepth(this.y);
      this.lastDepthY = currentY;
    }
  }

  public stopMovement(): void {
    const body = this.body as Physics.Arcade.Body | null;

    if (!body) {
      console.warn(
        `⚠️ Physics body не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    body.setVelocity(0);

    this.playIdleAnimation();
  }

  public move(direction: Direction): void {
    this.currentDirection = direction;

    const velocity = this.calculateVelocity(
      direction,
      this.config.speedWalking
    );

    const body = this.body as Physics.Arcade.Body | null;

    if (!body) {
      console.warn(
        `⚠️ Physics body не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    body.setVelocity(velocity.x, velocity.y);

    this.playWalkAnimation();
  }

  public runningManStep(): void {
    const body = this.body as Physics.Arcade.Body | null;

    if (!body) {
      console.warn(
        `⚠️ Physics body не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    body.setVelocity(0);

    this.playRunningManStepAnimation();
  }

  protected addAnimation(
    config: AnimationConfig & {
      prefix: Required<AnimationConfig['prefix']>;
      zeroPad: Required<AnimationConfig['zeroPad']>;
    }
  ): void {
    this.scene.anims.create({
      key: config.key,
      frames: this.scene.anims.generateFrameNames(this.config.textureKey, {
        start: config.start,
        end: config.end,
        prefix: config.prefix,
        zeroPad: config.zeroPad,
        suffix: config.suffix || '.png',
      }),
      frameRate: config.frameRate,
      repeat: config.repeat ?? -1,
      yoyo: config.yoyo ?? false,
    });
  }

  protected addIdleAnimation(config: {
    direction: Direction;
    prefix: string;
    start?: number;
    end?: number;
    frameRate?: number;
  }): void {
    const { direction, prefix, start, end, frameRate } = config;
    const animationKey = `idle_${direction}`;

    this.addAnimation({
      key: animationKey,
      prefix,
      start: start ?? 0,
      end: end ?? 3,
      frameRate: frameRate ?? 6,
      ...CHARACTER_ANIMATION_DEFAULTS,
    });
  }

  protected addWalkAnimation(config: {
    direction: Direction;
    prefix: string;
    start?: number;
    end?: number;
    frameRate?: number;
  }): void {
    const { direction, prefix, start, end, frameRate } = config;
    const animationKey = `walk_${direction}`;

    this.addAnimation({
      key: animationKey,
      prefix,
      start: start ?? 0,
      end: end ?? 5,
      frameRate: frameRate ?? 8,
      ...CHARACTER_ANIMATION_DEFAULTS,
    });
  }

  protected addRunningManStepAnimation(config: {
    direction: Direction;
    prefix: string;
    start?: number;
    end?: number;
    frameRate?: number;
  }): void {
    const { direction, prefix, start, end, frameRate } = config;
    const animationKey = `runningMan_${direction}`;

    this.addAnimation({
      key: animationKey,
      prefix,
      start: start ?? 0,
      end: end ?? 5,
      frameRate: frameRate ?? 8,
      ...CHARACTER_ANIMATION_DEFAULTS,
    });
  }

  protected setupPhysics(): void {
    const body = this.body as Physics.Arcade.Body | null;
    const width = this.width * this.config.colliderScaleX;
    const height = this.height * this.config.colliderScaleY;
    const offsetX = (this.width - width) / 2 + this.config.colliderOffsetX;
    const offsetY = (this.height - height) / 2 + this.config.colliderOffsetY;

    if (!body) {
      console.warn(
        `⚠️ Physics body не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    body.setSize(Math.round(width), Math.round(height), true);
    body.setOffset(Math.round(offsetX), Math.round(offsetY));
    body.setCollideWorldBounds(this.config.collideWorldBounds);
    body.pushable = this.config.pushable;
    body.setMaxVelocity(this.config.maxVelocity);
    body.setDrag(this.config.drag);
  }

  protected abstract setupIdleAnimations(): void;

  protected abstract setupWalkAnimations(): void;

  protected abstract setupRunningManStepAnimations(): void;

  private playIdleAnimation(): void {
    this.playSafe(`idle_${this.currentDirection}`, true);
  }

  private playWalkAnimation(): void {
    this.playSafe(`walk_${this.currentDirection}`, true);
  }

  private playRunningManStepAnimation(): void {
    this.playSafe(`runningMan_${this.currentDirection}`, true);
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
        console.warn(
          `⚠️ Анимация ${key} не обнаружена для ${this.constructor.name}`
        );
      }

      this.missingAnimCache.set(key, Date.now());
      this.anims.stop();

      return;
    }

    this.play(key, ignoreIfPlaying);
  }

  private calculateVelocity(
    direction: Direction,
    speed: number
  ): { x: number; y: number } {
    const velocityMap: Record<Direction, { x: number; y: number }> = {
      [Direction.NORTH]: { x: 0, y: -speed },
      [Direction.NORTH_EAST]: { x: speed * 0.7, y: -speed * 0.7 },
      [Direction.EAST]: { x: speed, y: 0 },
      [Direction.SOUTH_EAST]: { x: speed * 0.7, y: speed * 0.7 },
      [Direction.SOUTH]: { x: 0, y: speed },
      [Direction.SOUTH_WEST]: { x: -speed * 0.7, y: speed * 0.7 },
      [Direction.WEST]: { x: -speed, y: 0 },
      [Direction.NORTH_WEST]: { x: -speed * 0.7, y: -speed * 0.7 },
    };

    return velocityMap[direction] || { x: 0, y: 0 };
  }
}
