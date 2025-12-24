import type { Scene } from 'phaser';
import { Player } from '../abstract';
import { NetrunnerWoman } from '../characters';
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
      case 'netrunner':
        return this.createNetrunner(scene, baseConfig, custom);

      // case 'hoodie':
      //     return this.createHoodie(scene, baseConfig);

      default:
        console.warn(
          `Unknown character type: ${type}, using netrunner as fallback`
        );

        return this.createNetrunner(scene, baseConfig, custom);
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

  private static createNetrunner(
    scene: Scene,
    config: FactoryCharacterConfig,
    customConfig?: FactoryCharacterConfig['custom']
  ): NetrunnerWoman {
    return new NetrunnerWoman(scene, config.x, config.y, customConfig);
  }
}
