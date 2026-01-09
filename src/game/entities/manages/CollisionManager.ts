import type { Physics, Scene, Tilemaps } from 'phaser';
import { Player } from '../abstract';

export class CollisionManager {
  private scene: Scene;
  private charactersGroup: Physics.Arcade.Group;
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
    charactersList.forEach((character) => {
      this.charactersGroup.add(character);
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

  public cleanup(): void {
    this.colliders.forEach((collider) => {
      if (collider.active) {
        this.scene.physics.world.removeCollider(collider);
      }
    });

    this.colliders.length = 0;
    this.charactersGroup.clear(true, true);
  }
}
