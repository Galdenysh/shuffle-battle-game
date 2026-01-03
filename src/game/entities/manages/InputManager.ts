import { Input } from 'phaser';
import type { Scene, Types } from 'phaser';
import { ControlScheme } from '../types';
import type { WASDKeys } from '../types';
import { TouchManager } from './TouchManager';
import { Abilities, Direction } from '@/types';

export class InputManager {
  private scene: Scene;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private controlScheme: ControlScheme;

  // ===== СПЕЦПРИЁМЫ =====

  private keyR: Input.Keyboard.Key | null = null;
  private keyT: Input.Keyboard.Key | null = null;
  private keyY: Input.Keyboard.Key | null = null;
  private keyF: Input.Keyboard.Key | null = null;

  private _isAbilityMode: boolean = false;
  private _activeSpecialMove: Abilities | null = null;
  private specialMoveStartTime: number = 0;

  private specialMoveDurations: Record<Abilities, number> = {
    [Abilities.RUNNING_MAN]: 750,
    [Abilities.T_STEP_LEFT]: 375,
    [Abilities.T_STEP_RIGHT]: 375,
  };

  constructor(scene: Scene, scheme: ControlScheme = ControlScheme.ALL) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();
    this.setupTouch();

    this.calculateSpecialMoveDuration(
      Abilities.RUNNING_MAN,
      'runningMan_south'
    ); // TODO: убрать из InputManager

    this.calculateSpecialMoveDuration(Abilities.T_STEP_LEFT, 'tStepLeft_south'); // TODO: убрать из InputManager

    this.calculateSpecialMoveDuration(
      Abilities.T_STEP_RIGHT,
      'tStepRight_south'
    ); // TODO: убрать из InputManager

    this.scene.events.on('update', this.checkSpecialMoveTimeout.bind(this));
  }

  private setupInputs(): void {
    const keyboard = this.scene.input.keyboard;

    if (!keyboard) return;

    if (
      this.controlScheme === ControlScheme.ARROWS ||
      this.controlScheme === ControlScheme.BOTH ||
      this.controlScheme === ControlScheme.ALL
    ) {
      this.cursors = keyboard.createCursorKeys();
    }

    if (
      this.controlScheme === ControlScheme.WASD ||
      this.controlScheme === ControlScheme.BOTH ||
      this.controlScheme === ControlScheme.ALL
    ) {
      this.wasdKeys = keyboard.addKeys({
        up: Input.Keyboard.KeyCodes.W,
        down: Input.Keyboard.KeyCodes.S,
        left: Input.Keyboard.KeyCodes.A,
        right: Input.Keyboard.KeyCodes.D,
      }) as WASDKeys;
    }

    // ===== СПЕЦПРИЁМЫ =====

    this.keyR = keyboard.addKey(Input.Keyboard.KeyCodes.R);
    this.keyT = keyboard.addKey(Input.Keyboard.KeyCodes.T);
    this.keyY = keyboard.addKey(Input.Keyboard.KeyCodes.Y);
    this.keyF = keyboard.addKey(Input.Keyboard.KeyCodes.F);

    this.keyR.on('down', () => this.activateSpecialMove(Abilities.RUNNING_MAN));

    this.keyT.on('down', () => this.activateSpecialMove(Abilities.T_STEP_LEFT));

    this.keyY.on('down', () =>
      this.activateSpecialMove(Abilities.T_STEP_RIGHT)
    );

    this.keyF.on('down', () => this.toggleAbilityMode());

    // TODO: добавить метод destroy для отписки от on 'down'
  }

  private setupTouch(): void {
    const isTouchEnabled =
      this.controlScheme === ControlScheme.TOUCH ||
      this.controlScheme === ControlScheme.ALL;

    if (!isTouchEnabled) return;

    new TouchManager(this.scene);
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

  public get isMoving(): boolean {
    return this.horizontal !== 0 || this.vertical !== 0;
  }

  public get isRunningManStepActive(): boolean {
    return this._activeSpecialMove === Abilities.RUNNING_MAN;
  }

  public get isTStepLeftActive(): boolean {
    return this._activeSpecialMove === Abilities.T_STEP_LEFT;
  }

  public get isTStepRightActive(): boolean {
    return this._activeSpecialMove === Abilities.T_STEP_RIGHT;
  }

  public get activeSpecialMove(): Abilities | null {
    return this._activeSpecialMove;
  }

  public get isAbilityMode(): boolean {
    return this._isAbilityMode;
  }

  public get activeScheme(): ControlScheme {
    if (this.cursors && this.wasdKeys) return ControlScheme.BOTH;
    if (this.cursors) return ControlScheme.ARROWS;

    return ControlScheme.WASD;
  }

  private toggleAbilityMode(): void {
    this._isAbilityMode = !this._isAbilityMode;
  }

  private activateSpecialMove(moveType: Abilities): void {
    if (!this.vertical && !this.horizontal) return;
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
    moveType: Abilities,
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
