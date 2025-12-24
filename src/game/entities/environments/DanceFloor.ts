import type { Scene } from 'phaser';
import { Background } from '../abstract';
import { BackgroundConfig } from '../types';
import { BACKGROUND_ANIMATION_DEFAULTS } from '../constants';

export class DanceFloor extends Background {
  private static readonly DEFAULT_CONFIG: BackgroundConfig = {
    textureKey: 'background_anim',
    animationKey: 'dance_floor_anim',
  };

  constructor(
    scene: Scene,
    x: number,
    y: number,
    customConfig?: Partial<BackgroundConfig>
  ) {
    super(scene, x, y, { ...DanceFloor.DEFAULT_CONFIG, ...customConfig });
  }

  protected setupAnimations(): void {
    console.log('setupAnimations');

    this.addAnimation({
      key: DanceFloor.DEFAULT_CONFIG.animationKey,
      start: 0,
      end: 48,
      ...BACKGROUND_ANIMATION_DEFAULTS,
    });
  }

  public getConfig(): BackgroundConfig {
    return { ...this.config };
  }
}
