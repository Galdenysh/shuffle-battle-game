import type { Scene } from 'phaser';
import { EventBus } from '@/game/core';
import { EMIT_EVENT } from '@/game/constants';
import { Abilities, ControlMode, Direction } from '@/types';

export class TouchManager {
  private scene: Scene;

  private _mode: ControlMode = ControlMode.MOVE_MODE;

  private _touchMoveKeys: Record<Direction, { isDown: boolean }> = {
    north: { isDown: false },
    north_east: { isDown: false },
    east: { isDown: false },
    south_east: { isDown: false },
    south: { isDown: false },
    south_west: { isDown: false },
    west: { isDown: false },
    north_west: { isDown: false },
  };

  private _touchAbilitiesKeys: Record<Abilities, { isDown: boolean }> = {
    running_man: { isDown: false },
    t_step_left: { isDown: false },
    t_step_right: { isDown: false },
  };

  constructor(scene: Scene) {
    this.scene = scene;

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

  private setupEventListeners(): void {
    EventBus.on(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove.bind(this));
    EventBus.on(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility.bind(this));
    EventBus.on(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode.bind(this));

    this.scene.events.once('shutdown', this.cleanup.bind(this));
    this.scene.events.once('destroy', this.cleanup.bind(this));
  }

  private handleMove(move: Direction, isActive: boolean): void {
    this._touchMoveKeys[move].isDown = isActive;
  }

  private handleAbility(ability: Abilities, isActive: boolean): void {
    this._touchAbilitiesKeys[ability].isDown = isActive;
  }

  private handleMode(mode: ControlMode): void {
    this._mode = mode;
  }

  private cleanup(): void {
    EventBus.off(EMIT_EVENT.MOVE_TRIGGERED, this.handleMove.bind(this));
    EventBus.off(EMIT_EVENT.ABILITY_TRIGGERED, this.handleAbility.bind(this));
    EventBus.off(EMIT_EVENT.CONTROL_MODE_TRIGGERED, this.handleMode.bind(this));
  }
}
