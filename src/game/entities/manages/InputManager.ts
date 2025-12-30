import Phaser from 'phaser';
import type { Scene, Types } from 'phaser';
import { ControlScheme } from '../types';
import { SpecialMoveType } from '../types';
import type { WASDKeys } from '../types';

export class InputManager {
  private scene: Scene;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private controlScheme: ControlScheme;

  // ===== СПЕЦПРИЁМЫ =====

  private keyR: Phaser.Input.Keyboard.Key | null = null;
  private keyT: Phaser.Input.Keyboard.Key | null = null;
  private keyY: Phaser.Input.Keyboard.Key | null = null;

  private _activeSpecialMove: SpecialMoveType | null = null;
  private specialMoveStartTime: number = 0;
  private specialMoveDurations: Record<SpecialMoveType, number> = {
    [SpecialMoveType.RUNNING_MAN_STEP]: 750,
    [SpecialMoveType.T_STEP_LEFT]: 375,
    [SpecialMoveType.T_STEP_RIGHT]: 375,
  };

  constructor(scene: Scene, scheme: ControlScheme = ControlScheme.BOTH) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();

    this.calculateSpecialMoveDuration(
      SpecialMoveType.RUNNING_MAN_STEP,
      'runningMan_south'
    );

    this.calculateSpecialMoveDuration(
      SpecialMoveType.T_STEP_LEFT,
      'tStepLeft_south'
    );

    this.calculateSpecialMoveDuration(
      SpecialMoveType.T_STEP_RIGHT,
      'tStepRight_south'
    );

    this.scene.events.on('update', this.checkSpecialMoveTimeout.bind(this));
  }

  private setupInputs(): void {
    const keyboard = this.scene.input.keyboard;

    if (!keyboard) return;

    if (
      this.controlScheme === ControlScheme.ARROWS ||
      this.controlScheme === ControlScheme.BOTH
    ) {
      this.cursors = keyboard.createCursorKeys();
    }

    if (
      this.controlScheme === ControlScheme.WASD ||
      this.controlScheme === ControlScheme.BOTH
    ) {
      this.wasdKeys = keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      }) as WASDKeys;
    }

    // ===== СПЕЦПРИЁМЫ =====

    this.keyR = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.keyT = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    this.keyY = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);

    this.keyR.on('down', () =>
      this.activateSpecialMove(SpecialMoveType.RUNNING_MAN_STEP)
    );

    this.keyT.on('down', () =>
      this.activateSpecialMove(SpecialMoveType.T_STEP_LEFT)
    );

    this.keyY.on('down', () =>
      this.activateSpecialMove(SpecialMoveType.T_STEP_RIGHT)
    );
  }

  public get horizontal(): number {
    let value = 0;

    if (this.cursors?.left.isDown || this.wasdKeys?.left.isDown) value -= 1;
    if (this.cursors?.right.isDown || this.wasdKeys?.right.isDown) value += 1;

    return Math.max(-1, Math.min(1, value));
  }

  public get vertical(): number {
    let value = 0;

    if (this.cursors?.up.isDown || this.wasdKeys?.up.isDown) value -= 1;
    if (this.cursors?.down.isDown || this.wasdKeys?.down.isDown) value += 1;

    return Math.max(-1, Math.min(1, value));
  }

  public get direction(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.horizontal, this.vertical).normalize();
  }

  public get isMoving(): boolean {
    return this.horizontal !== 0 || this.vertical !== 0;
  }

  public get isRunningManStepActive(): boolean {
    return this._activeSpecialMove === SpecialMoveType.RUNNING_MAN_STEP;
  }

  public get isTStepLeftActive(): boolean {
    return this._activeSpecialMove === SpecialMoveType.T_STEP_LEFT;
  }

  public get isTStepRightActive(): boolean {
    return this._activeSpecialMove === SpecialMoveType.T_STEP_RIGHT;
  }

  public get activeSpecialMove(): SpecialMoveType | null {
    return this._activeSpecialMove;
  }

  public get activeScheme(): ControlScheme {
    if (this.cursors && this.wasdKeys) return ControlScheme.BOTH;
    if (this.cursors) return ControlScheme.ARROWS;

    return ControlScheme.WASD;
  }

  private activateSpecialMove(moveType: SpecialMoveType): void {
    if (this._activeSpecialMove !== null) return;

    this._activeSpecialMove = moveType;
    this.specialMoveStartTime = this.scene.time.now;
  }

  private checkSpecialMoveTimeout(): void {
    if (this._activeSpecialMove === null) return;

    const currentTime = this.scene.time.now;
    const duration = this.specialMoveDurations[this._activeSpecialMove];

    if (currentTime - this.specialMoveStartTime >= duration) {
      this._activeSpecialMove = null;
    }
  }

  private calculateSpecialMoveDuration(
    moveType: SpecialMoveType,
    animationKey: string
  ): void {
    const anim = this.scene.anims.get(animationKey);

    if (!anim) {
      console.warn(
        `⚠️ Анимация ${animationKey} не найдена для ${moveType} в ${this.constructor.name}`
      );

      return;
    }

    this.specialMoveDurations[moveType] =
      (anim.frames.length / anim.frameRate) * 1000;
  }
}
