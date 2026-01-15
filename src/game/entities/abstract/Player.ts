import { Physics } from 'phaser';
import type { Scene } from 'phaser';
import type { AnimationConfig, PlayerConfig } from '../types';
import { CHARACTER_ANIMATION_DEFAULTS } from '../constants';
import { Direction } from '@/types';

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

  public runningMan(direction: Direction): void {
    this.currentDirection = direction;

    const body = this.body as Physics.Arcade.Body | null;

    if (!body) {
      console.warn(
        `⚠️ Physics body не инициализирован в ${this.constructor.name}`
      );

      return;
    }

    body.setVelocity(0);

    this.playRunningManAnimation();
  }

  public tStepLeft(direction: Direction): void {
    const rotatedDirection = this.rotateDirection90Right(direction);

    this.currentDirection = rotatedDirection;

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

    body.setVelocity(velocity.x / 2, velocity.y / 2);

    this.playTStepLeftAnimation();
  }

  public tStepRight(direction: Direction): void {
    const rotatedDirection = this.rotateDirection90Left(direction);

    this.currentDirection = rotatedDirection;

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

    body.setVelocity(velocity.x / 2, velocity.y / 2);

    this.playTStepRightAnimation();
  }

  protected addAnimation(
    config: AnimationConfig & {
      prefix: Required<AnimationConfig['prefix']>;
      zeroPad: Required<AnimationConfig['zeroPad']>;
    }
  ): void {
    if (this.scene.anims.exists(`${this.config.textureKey}_${config.key}`)) {
      return;
    }

    this.scene.anims.create({
      key: `${this.config.textureKey}_${config.key}`,
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

  protected addRunningManAnimation(config: {
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

  protected addTStepLeftAnimation(config: {
    direction: Direction;
    prefix: string;
    start?: number;
    end?: number;
    frameRate?: number;
  }): void {
    const { direction, prefix, start, end, frameRate } = config;
    const animationKey = `tStepLeft_${direction}`;

    this.addAnimation({
      key: animationKey,
      prefix,
      start: start ?? 0,
      end: end ?? 5,
      frameRate: frameRate ?? 16,
      ...CHARACTER_ANIMATION_DEFAULTS,
    });
  }

  protected addTStepRightAnimation(config: {
    direction: Direction;
    prefix: string;
    start?: number;
    end?: number;
    frameRate?: number;
  }): void {
    const { direction, prefix, start, end, frameRate } = config;
    const animationKey = `tStepRight_${direction}`;

    this.addAnimation({
      key: animationKey,
      prefix,
      start: start ?? 0,
      end: end ?? 5,
      frameRate: frameRate ?? 16,
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

  protected abstract setupRunningManAnimations(): void;

  protected abstract setupTStepLeftAnimations(): void;

  protected abstract setupTStepRightAnimations(): void;

  protected initPlayer(): void {
    this.setupIdleAnimations();
    this.setupWalkAnimations();
    this.setupRunningManAnimations();
    this.setupTStepLeftAnimations();
    this.setupTStepRightAnimations();
    this.setupPhysics();
    this.playIdleAnimation();
  }

  private playIdleAnimation(): void {
    this.playSafe(
      `${this.config.textureKey}_idle_${this.currentDirection}`,
      true
    );
  }

  private playWalkAnimation(): void {
    this.playSafe(
      `${this.config.textureKey}_walk_${this.currentDirection}`,
      true
    );
  }

  private playRunningManAnimation(): void {
    this.playSafe(
      `${this.config.textureKey}_runningMan_${this.currentDirection}`,
      true
    );
  }

  private playTStepLeftAnimation(): void {
    this.playSafe(
      `${this.config.textureKey}_tStepLeft_${this.currentDirection}`,
      true
    );
  }

  private playTStepRightAnimation(): void {
    this.playSafe(
      `${this.config.textureKey}_tStepRight_${this.currentDirection}`,
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

  private rotateDirection90Left(direction: Direction): Direction {
    switch (direction) {
      case Direction.NORTH:
        return Direction.WEST;
      case Direction.NORTH_EAST:
        return Direction.NORTH_WEST;
      case Direction.EAST:
        return Direction.NORTH;
      case Direction.SOUTH_EAST:
        return Direction.NORTH_EAST;
      case Direction.SOUTH:
        return Direction.EAST;
      case Direction.SOUTH_WEST:
        return Direction.SOUTH_EAST;
      case Direction.WEST:
        return Direction.SOUTH;
      case Direction.NORTH_WEST:
        return Direction.SOUTH_WEST;
      default:
        return direction;
    }
  }

  private rotateDirection90Right(direction: Direction): Direction {
    switch (direction) {
      case Direction.NORTH:
        return Direction.EAST;
      case Direction.NORTH_EAST:
        return Direction.SOUTH_EAST;
      case Direction.EAST:
        return Direction.SOUTH;
      case Direction.SOUTH_EAST:
        return Direction.SOUTH_WEST;
      case Direction.SOUTH:
        return Direction.WEST;
      case Direction.SOUTH_WEST:
        return Direction.NORTH_WEST;
      case Direction.WEST:
        return Direction.NORTH;
      case Direction.NORTH_WEST:
        return Direction.NORTH_EAST;
      default:
        return direction;
    }
  }
}
