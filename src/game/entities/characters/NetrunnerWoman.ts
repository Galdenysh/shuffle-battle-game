import { Scene } from 'phaser';
import { Player } from '../abstract';
import type { CharacterType, Direction, PlayerConfig } from '../types';

export class NetrunnerWoman extends Player {
  private static readonly DEFAULT_CONFIG: PlayerConfig = {
    textureKey: 'character_netrunner_woman',
    defaultAnimationKey: 'walk_south',
    scale: 4,
    colliderScaleX: 0.4,
    colliderScaleY: 0.8,
    maxVelocity: 300,
    collideWorldBounds: true,
    drag: 800,
    speedWalking: 200,
  };

  private static readonly WALK_DIRECTION_PREFIXES: Record<Direction, string> = {
    east: 'walking-6-frames/east/frame_',
    north_east: 'walking-6-frames/north-east/frame_',
    north: 'walking-6-frames/north/frame_',
    north_west: 'walking-6-frames/north-west/frame_',
    west: 'walking-6-frames/west/frame_',
    south_west: 'walking-6-frames/south-west/frame_',
    south: 'walking-6-frames/south/frame_',
    south_east: 'walking-6-frames/south-east/frame_',
  } as const;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    customConfig?: Partial<PlayerConfig>
  ) {
    super(scene, x, y, { ...NetrunnerWoman.DEFAULT_CONFIG, ...customConfig });
  }

  public getConfig(): PlayerConfig {
    return { ...this.config };
  }

  public getType(): CharacterType {
    return 'netrunner';
  }

  protected setupWalkAnimations(): void {
    Object.entries(NetrunnerWoman.WALK_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addWalkAnimation(direction as Direction, prefix);
      }
    );
  }
}
