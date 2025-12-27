import { Scene } from 'phaser';
import { Player } from '../abstract';
import { CharacterType, Direction, PlayerConfig } from '../types';
import { ASSET_KEYS } from '@/game/constants';

export class NomadmechanicMan extends Player {
  private static readonly DEFAULT_CONFIG: PlayerConfig = {
    textureKey: ASSET_KEYS.CHAR_NOMAD_MECHANIC_MAN,
    defaultDirection: Direction.SOUTH,
    scale: 4,
    colliderScaleX: 0.3,
    colliderScaleY: 0.2,
    colliderOffsetX: 0,
    colliderOffsetY: 28,
    maxVelocity: 300,
    collideWorldBounds: true,
    pushable: false,
    drag: 800,
    speedWalking: 200,
  };

  private static readonly IDLE_DIRECTION_PREFIXES: Record<Direction, string> = {
    east: 'breathing-idle/east/frame_',
    north_east: 'breathing-idle/north-east/frame_',
    north: 'breathing-idle/north/frame_',
    north_west: 'breathing-idle/north-west/frame_',
    west: 'breathing-idle/west/frame_',
    south_west: 'breathing-idle/south-west/frame_',
    south: 'breathing-idle/south/frame_',
    south_east: 'breathing-idle/south-east/frame_',
  } as const;

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
    super(scene, x, y, { ...NomadmechanicMan.DEFAULT_CONFIG, ...customConfig });
  }

  public getConfig(): PlayerConfig {
    return { ...this.config };
  }

  public getType(): CharacterType {
    return 'nomadmechanic_man';
  }

  protected setupIdleAnimations(): void {
    Object.entries(NomadmechanicMan.IDLE_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addIdleAnimation(direction as Direction, prefix);
      }
    );
  }

  protected setupWalkAnimations(): void {
    Object.entries(NomadmechanicMan.WALK_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addWalkAnimation(direction as Direction, prefix);
      }
    );
  }
}
