import Phaser from 'phaser';
import type { Scene, Types } from 'phaser';
import { ControlScheme } from '../types';
import type { WASDKeys } from '../types';

export class InputManager {
  private scene: Scene;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private controlScheme: ControlScheme;

  private runningManStepKey: Phaser.Input.Keyboard.Key | null = null;
  private _isRunningManStepActive: boolean = false;
  private runningManStepStartTime: number = 0;
  private runningManStepDuration: number = 750;

  constructor(scene: Scene, scheme: ControlScheme = ControlScheme.BOTH) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();
    this.calculateRunningManStepDuration('runningMan_south');

    this.scene.events.on('update', this.checkRunningManTimeout.bind(this));
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

    // Спецприемы
    this.runningManStepKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.runningManStepKey.on('down', () => {
      this.activateRunningManStep();
    });
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
    return this._isRunningManStepActive;
  }

  public get activeScheme(): ControlScheme {
    if (this.cursors && this.wasdKeys) return ControlScheme.BOTH;
    if (this.cursors) return ControlScheme.ARROWS;

    return ControlScheme.WASD;
  }

  private activateRunningManStep(): void {
    if (this._isRunningManStepActive) return;

    this._isRunningManStepActive = true;
    this.runningManStepStartTime = this.scene.time.now;
  }

  private checkRunningManTimeout(): void {
    if (!this._isRunningManStepActive) return;

    const currentTime = this.scene.time.now;

    if (
      currentTime - this.runningManStepStartTime >=
      this.runningManStepDuration
    ) {
      this._isRunningManStepActive = false;
    }
  }

  private calculateRunningManStepDuration(key: string): void {
    const anim = this.scene.anims.get(key);

    if (!anim) return;

    this.runningManStepDuration = (anim.frames.length / anim.frameRate) * 1000;
  }
}
