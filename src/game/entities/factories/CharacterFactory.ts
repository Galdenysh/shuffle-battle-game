import type { Scene } from 'phaser';
import { Player } from '../abstract';
import { MCMan, ShufflerMan } from '../characters';
import type { FactoryCharacterConfig } from '../types';

export class CharacterFactory {
  static create(
    type: FactoryCharacterConfig['type'],
    scene: Scene,
    x: FactoryCharacterConfig['x'],
    y: FactoryCharacterConfig['y'],
    custom?: FactoryCharacterConfig['custom']
  ): Player {
    const baseConfig: FactoryCharacterConfig = {
      type,
      x,
      y,
    };

    switch (type) {
      case 'shuffler_man':
        return this.createShufflerMan(scene, baseConfig, custom);

      case 'mc_man':
        return this.createMCMan(scene, baseConfig, custom);

      default:
        console.warn(
          `Unknown character type: ${type}, using shuffler as fallback`
        );

        return this.createShufflerMan(scene, baseConfig, custom);
    }
  }

  static createFromJSON(
    scene: Scene,
    jsonData: FactoryCharacterConfig[]
  ): Player[] {
    return jsonData.map((charData) =>
      this.create(charData.type, scene, charData.x, charData.y, charData.custom)
    );
  }

  private static createMCMan(
    scene: Scene,
    config: FactoryCharacterConfig,
    customConfig?: FactoryCharacterConfig['custom']
  ): MCMan {
    return new MCMan(scene, config.x, config.y, customConfig);
  }

  private static createShufflerMan(
    scene: Scene,
    config: FactoryCharacterConfig,
    customConfig?: FactoryCharacterConfig['custom']
  ): ShufflerMan {
    return new ShufflerMan(scene, config.x, config.y, customConfig);
  }
}
