import { Input } from 'phaser';
import type { Scene, Types } from 'phaser';
import { ControlScheme } from '../types';
import type { WASDKeys } from '../types';
import { TouchManager } from './TouchManager';
import { Abilities, ControlMode } from '@/types';
import { EventBus } from '@/game/core';
import { EMIT_EVENT } from '@/game/constants';

export class InputManager {
  private scene: Scene;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private touchManager: TouchManager | null = null;
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
  }; // (anim.frames.length / anim.frameRate) * 1000;

  constructor(scene: Scene, scheme: ControlScheme = ControlScheme.ALL) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();
    this.setupTouch();
    this.bindSceneEvents();

    this.scene.events.on('update', this.checkSpecialMoveTimeout.bind(this));
  }

  public destroy(): void {
    if (this.scene.input.keyboard) {
      [this.keyR, this.keyT, this.keyY, this.keyF].forEach((key) => {
        if (key) {
          this.scene.input.keyboard?.removeKey(key.keyCode); // Phaser сам очистит обработчики
        }
      });
    }

    if (this.touchManager) {
      this.touchManager.destroy(); // TouchManager сам очистит обработчики
    }

    this.unbindSceneEvents();

    this.keyR = this.keyT = this.keyY = this.keyF = null;
    this.cursors = null;
    this.wasdKeys = null;
    this.touchManager = null;
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

    this.keyF.on('down', () => {
      this.toggleAbilityMode();

      const mode: ControlMode = this._isAbilityMode
        ? ControlMode.ABILITY_MODE
        : ControlMode.MOVE_MODE;

      EventBus.emit(EMIT_EVENT.CONTROL_MODE_TRIGGERED, mode);
    });
  }

  private setupTouch(): void {
    const isTouchEnabled =
      this.controlScheme === ControlScheme.TOUCH ||
      this.controlScheme === ControlScheme.ALL;

    if (!isTouchEnabled) return;

    this.touchManager = new TouchManager(this.scene);

    // ===== СПЕЦПРИЁМЫ =====

    const abilitiesKeys = this.touchManager.touchAbilitiesKeys;
    const modeKey = this.touchManager.touchModeKey;

    if (!abilitiesKeys || !modeKey) return;

    abilitiesKeys[Abilities.RUNNING_MAN].on('down', () =>
      this.activateSpecialMove(Abilities.RUNNING_MAN)
    );

    abilitiesKeys[Abilities.T_STEP_LEFT].on('down', () =>
      this.activateSpecialMove(Abilities.T_STEP_LEFT)
    );

    abilitiesKeys[Abilities.T_STEP_RIGHT].on('down', () =>
      this.activateSpecialMove(Abilities.T_STEP_RIGHT)
    );

    modeKey.on('change-mode', () => {
      this.setAbilityMode(modeKey.controlMode);
    });
  }

  private bindSceneEvents(): void {
    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);
  }

  private unbindSceneEvents(): void {
    this.scene.events.off('shutdown', this.destroy, this);
    this.scene.events.off('destroy', this.destroy, this);
  }

  public get horizontal(): number {
    let value = 0;
    const touchMoveKeys = this.touchManager?.touchMoveKeys;

    // Keyboard
    if (this.cursors?.left.isDown || this.wasdKeys?.left.isDown) value -= 1;
    if (this.cursors?.right.isDown || this.wasdKeys?.right.isDown) value += 1;

    // Touch
    if (touchMoveKeys?.west.isDown) value -= 1;
    if (touchMoveKeys?.east.isDown) value += 1;
    if (touchMoveKeys?.north_west.isDown) value -= 1;
    if (touchMoveKeys?.north_east.isDown) value += 1;
    if (touchMoveKeys?.south_west.isDown) value -= 1;
    if (touchMoveKeys?.south_east.isDown) value += 1;

    return Math.max(-1, Math.min(1, value));
  }

  public get vertical(): number {
    let value = 0;
    const touchMoveKeys = this.touchManager?.touchMoveKeys;

    // Keyboard
    if (this.cursors?.up.isDown || this.wasdKeys?.up.isDown) value -= 1;
    if (this.cursors?.down.isDown || this.wasdKeys?.down.isDown) value += 1;

    // Touch
    if (touchMoveKeys?.north.isDown) value -= 1;
    if (touchMoveKeys?.south.isDown) value += 1;
    if (touchMoveKeys?.north_west.isDown) value -= 1;
    if (touchMoveKeys?.north_east.isDown) value -= 1;
    if (touchMoveKeys?.south_west.isDown) value += 1;
    if (touchMoveKeys?.south_east.isDown) value += 1;

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
    if (this.cursors && this.wasdKeys && this.touchManager) {
      return ControlScheme.ALL;
    }

    if (this.cursors && this.wasdKeys && !this.touchManager) {
      return ControlScheme.BOTH;
    }

    if (this.cursors && !this.wasdKeys && !this.touchManager) {
      return ControlScheme.ARROWS;
    }

    if (!this.cursors && !this.wasdKeys && this.touchManager) {
      return ControlScheme.TOUCH;
    }

    return ControlScheme.WASD;
  }

  private toggleAbilityMode(): void {
    this._isAbilityMode = !this._isAbilityMode;
  }

  private setAbilityMode(mode: ControlMode | null): void {
    if (!mode) return;

    if (mode === ControlMode.ABILITY_MODE) {
      this._isAbilityMode = true;
    } else {
      this._isAbilityMode = false;
    }
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
}
