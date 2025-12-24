import { Player } from '../abstract';
import { InputManager } from '../manages';
import { Direction } from '../types';

export class PlayerController {
  private player: Player;
  private input: InputManager;

  constructor(player: Player, input: InputManager) {
    this.player = player;
    this.input = input;
  }

  public update(): void {
    if (!this.input.isMoving) {
      this.player.stop();

      return;
    }

    const direction = this.getDirectionFromInput();

    this.player.move(direction);
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

    return Direction.SOUTH;
  }
}

