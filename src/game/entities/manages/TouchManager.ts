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

class TouchModeKey extends Events.EventEmitter {
  public controlMode: ControlMode | null = null;

  constructor() {
    super();
  }
}

export class TouchManager {
  private scene: Scene;

  private _touchMoveKeys: Record<Direction, TouchKey> | null = null;
  private _touchAbilitiesKeys: Record<Abilities, TouchKey> | null = null;
  private _touchModeKey: TouchModeKey | null = null;

  constructor(scene: Scene) {
    this.scene = scene;

    this._touchMoveKeys = this.createMoveKeys();
    this._touchAbilitiesKeys = this.createAbilityKeys();
    this._touchModeKey = new TouchModeKey();

    this.setupEventListeners();
  }

  public destroy() {
    if (this._touchMoveKeys) {
      Object.values(this._touchMoveKeys).forEach((key) => key.destroy());
    }

    if (this._touchAbilitiesKeys) {
      Object.values(this._touchAbilitiesKeys).forEach((key) => key.destroy());
    }

    if (this._touchModeKey) {
      this._touchModeKey.destroy();
    }

    EventBus.off(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove, this);
    EventBus.off(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility, this);
    EventBus.off(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode, this);

    this.scene.events.off('shutdown', this.destroy, this);
    this.scene.events.off('destroy', this.destroy, this);

    this._touchMoveKeys = null;
    this._touchAbilitiesKeys = null;
    this._touchModeKey = null;
  }

  public get touchMoveKeys() {
    return this._touchMoveKeys;
  }

  public get touchAbilitiesKeys() {
    return this._touchAbilitiesKeys;
  }

  public get touchModeKey() {
    return this._touchModeKey;
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
    EventBus.on(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove, this);
    EventBus.on(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility, this);
    EventBus.on(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode, this);

    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);
  }

  private handleMove(direction: Direction, isActive: boolean): void {
    const key = this._touchMoveKeys?.[direction];

    if (!key) return;

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
    const key = this._touchAbilitiesKeys?.[ability];

    if (!key) return;

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
    const key = this._touchModeKey;

    if (!key) return;

    key.controlMode = mode;

    key.emit('change-mode');
  }
}
