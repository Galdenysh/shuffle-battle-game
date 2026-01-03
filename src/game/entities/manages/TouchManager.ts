import { Events } from 'phaser';
import type { Scene } from 'phaser';
import { EventBus } from '@/game/core';
import { EMIT_EVENT } from '@/game/constants';
import { Abilities, ControlMode, Direction } from '@/types';

class TouchKey extends Events.EventEmitter {
  public isDown: boolean = false;
  public isUp: boolean = false;

  constructor() {
    super();
  }
}

export class TouchManager {
  private scene: Scene;

  private _touchMoveKeys: Record<Direction, TouchKey>;
  private _touchAbilitiesKeys: Record<Abilities, TouchKey>;

  private _mode: ControlMode = ControlMode.MOVE_MODE;

  constructor(scene: Scene) {
    this.scene = scene;

    this._touchMoveKeys = this.createMoveKeys();
    this._touchAbilitiesKeys = this.createAbilityKeys();

    this.setupEventListeners();
  }

  public get touchMoveKeys() {
    return this._touchMoveKeys;
  }

  public get touchAbilitiesKeys() {
    return this._touchAbilitiesKeys;
  }

  public get mode() {
    return this._mode;
  }

  private createMoveKeys(): Record<Direction, TouchKey> {
    const keys: Partial<Record<Direction, TouchKey>> = {};

    Object.values(Direction).forEach((direction) => {
      keys[direction] = new TouchKey();
    });

    return keys as Record<Direction, TouchKey>;
  }

  private createAbilityKeys(): Record<Abilities, TouchKey> {
    const keys: Partial<Record<Abilities, TouchKey>> = {};

    Object.values(Abilities).forEach((ability) => {
      keys[ability] = new TouchKey();
    });

    return keys as Record<Abilities, TouchKey>;
  }

  private setupEventListeners(): void {
    EventBus.on(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove.bind(this));
    EventBus.on(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility.bind(this));
    EventBus.on(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode.bind(this));

    this.scene.events.once('shutdown', this.cleanup.bind(this));
    this.scene.events.once('destroy', this.cleanup.bind(this));
  }

  private handleMove(direction: Direction, isActive: boolean): void {
    const key = this._touchMoveKeys[direction];

    if (isActive && !key.isDown) {
      key.isDown = true;
      key.isUp = false;

      key.emit('down');
    } else if (!isActive && key.isDown) {
      key.isDown = false;
      key.isUp = true;

      key.emit('up');
    }
  }

  private handleAbility(ability: Abilities, isActive: boolean): void {
    const key = this._touchAbilitiesKeys[ability];

    if (isActive && !key.isDown) {
      key.isDown = true;
      key.isUp = false;

      key.emit('down');
    } else if (!isActive && key.isDown) {
      key.isDown = false;
      key.isUp = true;

      key.emit('up');
    }
  }

  private handleMode(mode: ControlMode): void {
    this._mode = mode;
  }

  private cleanup(): void {
    Object.values(this._touchMoveKeys).forEach((key) => key.destroy());
    Object.values(this._touchAbilitiesKeys).forEach((key) => key.destroy());

    EventBus.off(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove.bind(this));
    EventBus.off(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility.bind(this));
    EventBus.off(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode.bind(this));
  }
}
