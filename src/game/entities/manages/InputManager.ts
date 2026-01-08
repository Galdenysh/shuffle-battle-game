import { Input } from 'phaser';
import type { Scene, Types } from 'phaser';
import { EventBus } from '@/game/core';
import { TouchKeyPlugin } from './TouchKeyPlugin';
import { ControlScheme } from '../types';
import type { WASDKeys } from '../types';
import { Abilities, ControlMode, EmitEvents } from '@/types';

export class InputManager {
  private scene: Scene | null = null;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private touchKeyPlugin: TouchKeyPlugin | null = null;
  private controlScheme: ControlScheme = ControlScheme.ALL;

  // ===== Спецприемы =====

  private keyR: Input.Keyboard.Key | null = null;
  private keyT: Input.Keyboard.Key | null = null;
  private keyY: Input.Keyboard.Key | null = null;
  private keyF: Input.Keyboard.Key | null = null;

  private _isStopMode: boolean = false;
  private _activeAbility: Abilities | null = null;
  private _abilityStartTime: number = 0;

  private abilityDurations: Record<Abilities, number> = {
    [Abilities.RUNNING_MAN]: 750,
    [Abilities.T_STEP_LEFT]: 375,
    [Abilities.T_STEP_RIGHT]: 375,
  }; // (anim.frames.length / anim.frameRate) * 1000;

  constructor(scene: Scene, scheme: ControlScheme) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();
    this.setupTouch();
    this.bindSceneEvents();

    this.scene.events.on('update', this.checkAbilityTimeout.bind(this));
  }

  public destroy(): void {
    if (this.scene) {
      const { keyboard } = this.scene.input;

      if (keyboard) {
        [this.keyR, this.keyT, this.keyY, this.keyF].forEach((key) => {
          if (key) {
            keyboard.removeKey(key.keyCode); // Phaser сам очистит обработчики
          }
        });
      }
    }

    this.touchKeyPlugin?.destroy(); // TouchKeyPlugin сам очистит обработчики

    this.unbindSceneEvents();

    this.keyR = this.keyT = this.keyY = this.keyF = null;
    this.cursors = null;
    this.wasdKeys = null;
    this.touchKeyPlugin = null;
    this.scene = null;
  }

  private setupInputs(): void {
    if (!this.scene) return;

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

    // ===== Спецприемы =====

    this.keyR = keyboard.addKey(Input.Keyboard.KeyCodes.R);
    this.keyT = keyboard.addKey(Input.Keyboard.KeyCodes.T);
    this.keyY = keyboard.addKey(Input.Keyboard.KeyCodes.Y);
    this.keyF = keyboard.addKey(Input.Keyboard.KeyCodes.F);

    this.keyR.on('down', () => this.activateAbility(Abilities.RUNNING_MAN));

    this.keyT.on('down', () => this.activateAbility(Abilities.T_STEP_LEFT));

    this.keyY.on('down', () => this.activateAbility(Abilities.T_STEP_RIGHT));

    this.keyF.on('down', () => {
      this.toggleAbilityMode();

      const mode: ControlMode = this._isStopMode
        ? ControlMode.STOP_MODE
        : ControlMode.MOVE_MODE;

      EventBus.emit(EmitEvents.CONTROL_MODE_TRIGGERED, { mode });
    });
  }

  private setupTouch(): void {
    if (!this.scene) return;

    const isTouchEnabled =
      this.controlScheme === ControlScheme.TOUCH ||
      this.controlScheme === ControlScheme.ALL;

    if (!isTouchEnabled) return;

    this.touchKeyPlugin = new TouchKeyPlugin(this.scene);

    // ===== Спецприемы =====

    const abilitiesKeys = this.touchKeyPlugin.touchAbilitiesKeys;
    const modeKey = this.touchKeyPlugin.touchModeKey;

    if (!abilitiesKeys || !modeKey) return;

    abilitiesKeys[Abilities.RUNNING_MAN].on('down', () =>
      this.activateAbility(Abilities.RUNNING_MAN)
    );

    abilitiesKeys[Abilities.T_STEP_LEFT].on('down', () =>
      this.activateAbility(Abilities.T_STEP_LEFT)
    );

    abilitiesKeys[Abilities.T_STEP_RIGHT].on('down', () =>
      this.activateAbility(Abilities.T_STEP_RIGHT)
    );

    modeKey.on('change-mode', () => {
      this.setStopMode(modeKey.controlMode);
    });
  }

  private bindSceneEvents(): void {
    if (!this.scene) return;

    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);
  }

  private unbindSceneEvents(): void {
    if (!this.scene) return;

    this.scene.events.off('shutdown', this.destroy, this);
    this.scene.events.off('destroy', this.destroy, this);
  }

  public get horizontal(): number {
    let value = 0;
    const touchMoveKeys = this.touchKeyPlugin?.touchMoveKeys;

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
    const touchMoveKeys = this.touchKeyPlugin?.touchMoveKeys;

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

  public get isRunningManActive(): boolean {
    return this._activeAbility === Abilities.RUNNING_MAN;
  }

  public get isTStepLeftActive(): boolean {
    return this._activeAbility === Abilities.T_STEP_LEFT;
  }

  public get isTStepRightActive(): boolean {
    return this._activeAbility === Abilities.T_STEP_RIGHT;
  }

  public get activeAbility(): Abilities | null {
    return this._activeAbility;
  }

  public get abilityStartTime(): number {
    return this._abilityStartTime;
  }

  public get isStopMode(): boolean {
    return this._isStopMode;
  }

  public get activeScheme(): ControlScheme {
    if (this.cursors && this.wasdKeys && this.touchKeyPlugin) {
      return ControlScheme.ALL;
    }

    if (this.cursors && this.wasdKeys && !this.touchKeyPlugin) {
      return ControlScheme.BOTH;
    }

    if (this.cursors && !this.wasdKeys && !this.touchKeyPlugin) {
      return ControlScheme.ARROWS;
    }

    if (!this.cursors && !this.wasdKeys && this.touchKeyPlugin) {
      return ControlScheme.TOUCH;
    }

    return ControlScheme.WASD;
  }

  private toggleAbilityMode(): void {
    this._isStopMode = !this._isStopMode;
  }

  private setStopMode(mode: ControlMode | null): void {
    if (!mode) return;

    if (mode === ControlMode.STOP_MODE) {
      this._isStopMode = true;
    } else {
      this._isStopMode = false;
    }
  }

  private activateAbility(moveType: Abilities): void {
    if (!this.scene) return;

    if (!this.vertical && !this.horizontal) return;
    if (this._activeAbility !== null) return;

    this._activeAbility = moveType;
    this._abilityStartTime = this.scene.time.now;
  }

  private checkAbilityTimeout(): void {
    if (!this.scene) return;

    if (this._activeAbility === null) return;

    const currentTime = this.scene.time.now;
    const duration = this.abilityDurations[this._activeAbility];

    if (currentTime - this._abilityStartTime >= duration) {
      this._activeAbility = null;
    }
  }
}
