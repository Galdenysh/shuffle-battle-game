import type { Physics, Scene, Tilemaps } from 'phaser';
import { Player } from '../abstract';

export class CollisionManager {
  private scene: Scene | null;
  private charactersGroup: Physics.Arcade.Group | null;
  private colliders: Physics.Arcade.Collider[] = [];

  constructor(scene: Scene) {
    this.scene = scene;

    this.charactersGroup = this.scene.physics.add.group({
      collideWorldBounds: true,
    });
  }

  public setup(
    charactersList: Player[],
    wallsLayer: Tilemaps.TilemapLayer | null
  ) {
    if (!this.scene || !this.charactersGroup) return;

    charactersList.forEach((character) => {
      this.charactersGroup?.add(character);
    });

    if (wallsLayer) {
      const wallCollider = this.scene.physics.add.collider(
        this.charactersGroup,
        wallsLayer
      );

      this.colliders.push(wallCollider);
    }

    const selfCollider = this.scene.physics.add.collider(
      this.charactersGroup,
      this.charactersGroup
    );

    this.colliders.push(selfCollider);

    return this.charactersGroup;
  }

  public destroy(): void {
    this.scene = null;
    this.charactersGroup = null;
    this.colliders.length = 0;
  }
}
