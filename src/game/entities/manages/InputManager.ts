import type { Scene, Types } from 'phaser';
import { ControlScheme } from '../types';
import type { WASDKeys } from '../types';

export class InputManager {
  private scene: Scene;
  private cursors: Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private controlScheme: ControlScheme;

  constructor(scene: Scene, scheme: ControlScheme = ControlScheme.BOTH) {
    this.scene = scene;
    this.controlScheme = scheme;

    this.setupInputs();
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

  public get activeScheme(): ControlScheme {
    if (this.cursors && this.wasdKeys) return ControlScheme.BOTH;
    if (this.cursors) return ControlScheme.ARROWS;

    return ControlScheme.WASD;
  }
}
