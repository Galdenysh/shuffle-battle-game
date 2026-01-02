import { Direction } from '@/types';
import { Player } from '../abstract';
import { InputManager } from '../manages';

export class PlayerController {
  private player: Player;
  private input: InputManager;
  private fixedDirection: Direction;
  private lastDirection: Direction = Direction.SOUTH;

  constructor(player: Player, input: InputManager) {
    this.player = player;
    this.input = input;
  }

  public update(): void {
    const currentDirection = this.getDirectionFromInput();

    if (this.input.isMoving) this.lastDirection = currentDirection;

    this.fixedDirection = this.input.activeSpecialMove
      ? this.fixedDirection ?? this.lastDirection
      : this.lastDirection;

    if (this.input.isRunningManStepActive) {
      this.player.runningManStep(this.fixedDirection);

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

    if (!this.input.isMoving || this.input.isAbilityMode) {
      this.player.stopMovement();

      return;
    }

    if (!this.input.isAbilityMode) this.player.move(currentDirection);
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
}
