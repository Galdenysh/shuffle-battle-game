import { Scene } from 'phaser';
import { Player } from '../abstract';
import { CharacterType, PlayerConfig } from '../types';
import { ASSET_KEYS } from '@/game/constants';
import { Direction } from '@/types';

export class MCMan extends Player {
  private static readonly DEFAULT_CONFIG: PlayerConfig = {
    textureKey: ASSET_KEYS.CHAR_MC_MAN,
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
    east: 'idle/east/frame_',
    north_east: 'idle/north-east/frame_',
    north: 'idle/north/frame_',
    north_west: 'idle/north-west/frame_',
    west: 'idle/west/frame_',
    south_west: 'idle/south-west/frame_',
    south: 'idle/south/frame_',
    south_east: 'idle/south-east/frame_',
  } as const;

  private static readonly WALK_DIRECTION_PREFIXES: Record<Direction, string> = {
    east: 'walking/east/frame_',
    north_east: 'walking/north-east/frame_',
    north: 'walking/north/frame_',
    north_west: 'walking/north-west/frame_',
    west: 'walking/west/frame_',
    south_west: 'walking/south-west/frame_',
    south: 'walking/south/frame_',
    south_east: 'walking/south-east/frame_',
  } as const;

  private static readonly RUNNING_MAN_DIRECTION_PREFIXES: Record<
    Direction,
    string
  > = {
    east: 'running/east/frame_',
    north_east: 'running/north-east/frame_',
    north: 'running/north/frame_',
    north_west: 'running/north-west/frame_',
    west: 'running/west/frame_',
    south_west: 'running/south-west/frame_',
    south: 'running/south/frame_',
    south_east: 'running/south-east/frame_',
  } as const;

  private static readonly T_STEP_LEFT_DIRECTION_PREFIXES: Record<
    Direction,
    string
  > = {
    east: 't-step-left/east/frame_',
    north_east: 't-step-left/north-east/frame_',
    north: 't-step-left/north/frame_',
    north_west: 't-step-left/north-west/frame_',
    west: 't-step-left/west/frame_',
    south_west: 't-step-left/south-west/frame_',
    south: 't-step-left/south/frame_',
    south_east: 't-step-left/south-east/frame_',
  } as const;

  private static readonly T_STEP_RIGHT_DIRECTION_PREFIXES: Record<
    Direction,
    string
  > = {
    east: 't-step-right/east/frame_',
    north_east: 't-step-right/north-east/frame_',
    north: 't-step-right/north/frame_',
    north_west: 't-step-right/north-west/frame_',
    west: 't-step-right/west/frame_',
    south_west: 't-step-right/south-west/frame_',
    south: 't-step-right/south/frame_',
    south_east: 't-step-right/south-east/frame_',
  } as const;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    customConfig?: Partial<PlayerConfig>
  ) {
    super(scene, x, y, { ...MCMan.DEFAULT_CONFIG, ...customConfig });

    this.initPlayer()
  }

  public getConfig(): PlayerConfig {
    return { ...this.config };
  }

  public getType(): CharacterType {
    return 'mc_man';
  }

  protected setupIdleAnimations(): void {
    Object.entries(MCMan.IDLE_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addIdleAnimation({ direction: direction as Direction, prefix });
      }
    );
  }

  protected setupWalkAnimations(): void {
    Object.entries(MCMan.WALK_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addWalkAnimation({ direction: direction as Direction, prefix });
      }
    );
  }

  protected setupRunningManAnimations(): void {
    Object.entries(MCMan.RUNNING_MAN_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addRunningManAnimation({
          direction: direction as Direction,
          prefix,
        });
      }
    );
  }

  protected setupTStepLeftAnimations(): void {
    Object.entries(MCMan.T_STEP_LEFT_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addTStepLeftAnimation({
          direction: direction as Direction,
          prefix,
        });
      }
    );
  }

  protected setupTStepRightAnimations(): void {
    Object.entries(MCMan.T_STEP_RIGHT_DIRECTION_PREFIXES).forEach(
      ([direction, prefix]) => {
        this.addTStepRightAnimation({
          direction: direction as Direction,
          prefix,
        });
      }
    );
  }
}
