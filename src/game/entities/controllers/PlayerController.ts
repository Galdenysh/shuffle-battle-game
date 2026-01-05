import { WEBGL } from 'phaser';
import { Player } from '../abstract';
import { ComboManager, ComboSystem, InputManager } from '../manages';
import { combos } from '@/game/config';
import type { AbilityRecord, Combo } from '../types';
import { Abilities, Direction } from '@/types';

export class PlayerController {
  private player: Player | null = null;
  private input: InputManager | null = null;
  private fixedDirection: Direction;
  private lastDirection: Direction = Direction.SOUTH;
  private abilityStartTime: number = -1;
  private abilityHistory: AbilityRecord[] = [];
  private comboSystem: ComboSystem;
  private comboManager: ComboManager;

  private comboListener: (
    combo: Combo,
    score: number,
    records: AbilityRecord[]
  ) => void;

  constructor(player: Player, input: InputManager) {
    this.player = player;
    this.input = input;

    this.comboSystem = new ComboSystem(combos);
    this.comboManager = new ComboManager(this.comboSystem, this.player);

    this.comboListener = this.onComboAchieved.bind(this);
    this.comboManager.addComboListener(this.comboListener);
  }

  public update(): void {
    if (!this.input || !this.player) return;

    const currentDirection = this.getDirectionFromInput();
    const currentGameTime = this.player.scene.time.now;

    if (this.input.isMoving) this.lastDirection = currentDirection;

    this.fixedDirection = this.input.activeAbility
      ? this.fixedDirection ?? this.lastDirection
      : this.lastDirection;

    if (this.input.activeAbility) {
      if (this.abilityStartTime !== this.input.abilityStartTime) {
        this.abilityStartTime = this.input.abilityStartTime;

        this.recordAbility(
          this.input.activeAbility,
          currentGameTime,
          this.fixedDirection
        );

        this.checkForCombos();
      }
    }

    // ===== Проигрывание анимаций =====

    if (this.input.isRunningManActive) {
      this.player.runningMan(this.fixedDirection);

      return;
    }

    if (this.input.isTStepLeftActive) {
      this.player.tStepLeft(this.fixedDirection);

      return;
    }

    if (this.input.isTStepRightActive) {
      this.player.tStepRight(this.fixedDirection);

      return;
    }

    if (!this.input.isMoving || this.input.isStopMode) {
      this.player.stopMovement();

      return;
    }

    if (!this.input.isStopMode) this.player.move(currentDirection);
  }

  public destroy(): void {
    if (this.comboManager && this.comboListener) {
      this.comboManager.removeComboListener(this.comboListener);
    }

    this.abilityHistory = [];
    this.player = null;
    this.input = null;
  }

  private getDirectionFromInput(): Direction {
    if (!this.input) return Direction.SOUTH;

    const h = this.input.horizontal;
    const v = this.input.vertical;

    if (v < 0 && h > 0) return Direction.NORTH_EAST;
    if (v < 0 && h < 0) return Direction.NORTH_WEST;
    if (v > 0 && h > 0) return Direction.SOUTH_EAST;
    if (v > 0 && h < 0) return Direction.SOUTH_WEST;
    if (h < 0) return Direction.WEST;
    if (h > 0) return Direction.EAST;
    if (v < 0) return Direction.NORTH;
    if (v > 0) return Direction.SOUTH;

    return this.lastDirection;
  }

  private recordAbility(
    ability: Abilities,
    timestamp: number,
    direction: Direction
  ): void {
    this.abilityHistory.push({ ability, timestamp, direction });

    // Ограничиваем историю
    if (this.abilityHistory.length > 20) {
      this.abilityHistory.shift();
    }
  }

  private checkForCombos(): void {
    this.comboManager.processAbilityHistory(this.abilityHistory);
  }

  private onComboAchieved(combo: Combo, score: number): void {
    this.clearAbilityRecord();
    this.showComboEffect(combo, score);
  }

  private clearAbilityRecord(): void {
    this.abilityHistory.length = 0;
  }

  private showComboEffect(combo: Combo, score: number): void {
    if (!this.player) return;

    const scene = this.player.scene;

    const text = scene.add
      .text(this.player.x, this.player.y - 200, `${combo.name}!\n+${score}`, {
        fontFamily: 'JetBrains Mono',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#00f3ff',
        stroke: '#0a0a2a',
        strokeThickness: 8,
        align: 'center',
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    if (scene.renderer.type === WEBGL) {
      text.postFX.addGlow(0x00f3ff, 3, 0, false, 0.1, 10);
    }

    scene.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      duration: 5000,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    scene.cameras.main.flash(150, 100, 150, 255);
    scene.cameras.main.shake(300, 0.01);
  }
}
