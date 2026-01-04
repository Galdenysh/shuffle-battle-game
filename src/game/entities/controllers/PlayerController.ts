import { Abilities, Direction } from '@/types';
import { Player } from '../abstract';
import { ComboManager, InputManager } from '../manages';
import type { AbilityRecord, Combo } from '../types';

export class PlayerController {
  private player: Player;
  private input: InputManager;
  private fixedDirection: Direction;
  private lastDirection: Direction = Direction.SOUTH;
  private abilityStartTime: number = -1;
  private abilityHistory: AbilityRecord[] = [];
  private comboManager: ComboManager;

  constructor(player: Player, input: InputManager) {
    this.player = player;
    this.input = input;

    this.comboManager = new ComboManager();

    this.comboManager.addComboListener(this.onComboAchieved.bind(this));
  }

  public update(): void {
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

  private getDirectionFromInput(): Direction {
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

  private onComboAchieved(
    combo: Combo,
    score: number,
    records: AbilityRecord[]
  ): void {
    this.removeUsedAbilities(records.length);
    this.showComboEffect(combo, score);
  }

  private removeUsedAbilities(count: number): void {
    this.abilityHistory = this.abilityHistory.slice(0, -count);
  }

  private showComboEffect(combo: Combo, score: number): void {
    const scene = this.player.scene;

    const text = scene.add
      .text(this.player.x, this.player.y - 200, `${combo.name}!\n+${score}`, {
        fontSize: '48px',
        color: '#00d3f2',
        stroke: '#000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5);

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
