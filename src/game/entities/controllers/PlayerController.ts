import { WEBGL } from 'phaser';
import { Player } from '../abstract';
import { ComboManager, InputManager } from '../manages';
import type { AbilityRecord, Combo } from '../types';
import { Abilities, Direction } from '@/types';
import { ASSET_KEYS } from '@/game/constants';

export class PlayerController {
  private player: Player | null = null;
  private inputManager: InputManager | null = null;
  private comboManager: ComboManager | null = null;
  private fixedDirection: Direction;
  private lastDirection: Direction = Direction.SOUTH;
  private abilityStartTime: number = -1;
  private abilityHistory: AbilityRecord[] = [];

  constructor(
    player: Player,
    inputManager: InputManager,
    comboManager: ComboManager
  ) {
    this.player = player;
    this.inputManager = inputManager;
    this.comboManager = comboManager;
  }

  public update(): void {
    if (!this.inputManager || !this.player) return;

    const currentDirection = this.getDirectionFromInput();
    const currentGameTime = this.player.scene.time.now;

    if (this.inputManager.isMoving) this.lastDirection = currentDirection;

    // Фиксация направления на время выполнения способности
    this.fixedDirection = this.inputManager.activeAbility
      ? this.fixedDirection ?? this.lastDirection
      : this.lastDirection;

    if (this.inputManager.activeAbility) {
      if (this.abilityStartTime !== this.inputManager.abilityStartTime) {
        this.abilityStartTime = this.inputManager.abilityStartTime;

        this.recordAbility(
          this.inputManager.activeAbility,
          currentGameTime,
          this.fixedDirection
        );

        this.checkForCombos();
      }
    }

    // ===== Проигрывание анимаций =====

    if (this.inputManager.isRunningManActive) {
      this.player.runningMan(this.fixedDirection);

      return;
    }

    if (this.inputManager.isTStepLeftActive) {
      this.player.tStepLeft(this.fixedDirection);

      return;
    }

    if (this.inputManager.isTStepRightActive) {
      this.player.tStepRight(this.fixedDirection);

      return;
    }

    if (!this.inputManager.isMoving || this.inputManager.isStopMode) {
      this.player.stopMovement();

      return;
    }

    if (!this.inputManager.isStopMode) this.player.move(currentDirection);
  }

  public onComboAchieved(combo: Combo, points: number | null): void {
    this.clearAbilityRecord();
    this.showComboEffect(combo, points);
  }

  public destroy(): void {
    this.abilityHistory = [];
    this.player = null;
    this.inputManager = null;
    this.comboManager = null;
  }

  private getDirectionFromInput(): Direction {
    if (!this.inputManager) return Direction.SOUTH;

    const h = this.inputManager.horizontal;
    const v = this.inputManager.vertical;

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
    if (!this.comboManager || !this.player) return;

    const currentGameTime = this.player.scene.time.now;

    this.comboManager.processAbilityHistory(
      this.abilityHistory,
      currentGameTime
    );
  }

  private clearAbilityRecord(): void {
    this.abilityHistory.length = 0;
  }

  private playSound(key: string, volume: number = 0.5): void {
    if (!this.player) return;

    this.player.scene.sound.play(key, { volume });
  }

  private showComboEffect(combo: Combo, points: number | null): void {
    if (!this.player) return;

    const scene = this.player.scene;

    const comboPointsText =
      points !== null ? `${combo.name}!\n+${points}` : `${combo.name}!`;

    const text = scene.add
      .text(this.player.x, this.player.y - 200, comboPointsText, {
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

    text.setDepth(1500);

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

    this.playSound(ASSET_KEYS.SFX_COMBO_SUCCESS)
  }
}
