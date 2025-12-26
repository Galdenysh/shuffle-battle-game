import type { Scene } from 'phaser';
import { Player } from '../abstract';
import { NetrunnerWoman, NomadmechanicMan } from '../characters';
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
      case 'netrunner_woman':
        return this.createNetrunnerWoman(scene, baseConfig, custom);

      case 'nomadmechanic_man':
          return this.createNomadmechanicMan(scene, baseConfig);

      default:
        console.warn(
          `Unknown character type: ${type}, using netrunner as fallback`
        );

        return this.createNetrunnerWoman(scene, baseConfig, custom);
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

  private static createNetrunnerWoman(
    scene: Scene,
    config: FactoryCharacterConfig,
    customConfig?: FactoryCharacterConfig['custom']
  ): NetrunnerWoman {
    return new NetrunnerWoman(scene, config.x, config.y, customConfig);
  }

    private static createNomadmechanicMan(
    scene: Scene,
    config: FactoryCharacterConfig,
    customConfig?: FactoryCharacterConfig['custom']
  ): NomadmechanicMan {
    return new NomadmechanicMan(scene, config.x, config.y, customConfig);
  }
}
