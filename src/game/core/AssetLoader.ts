import type { Scene } from 'phaser';
import type { CharacterType } from '../entities';
import { ASSET_KEYS, CHARACTER_NAME_TO_KEY } from '../constants';

export class AssetLoader {
  static preload(
    scene: Scene,
    options: {
      environmentName: string;
      charactersNameList: CharacterType[];
    }
  ): void {
    AssetLoader.loadEnvironment(scene, options.environmentName);
    AssetLoader.loadCharacters(scene, options.charactersNameList);
  }

  static loadEnvironment(scene: Scene, environmentName: string): void {
    const env = scene.load;

    env.image(
      ASSET_KEYS.ENV_BACKGROUND,
      `assets/environment/${environmentName}/background.png`
    );

    env.image(
      ASSET_KEYS.ENV_FOREGROUND,
      `assets/environment/${environmentName}/foreground.png`
    );

    env.spritesheet(
      ASSET_KEYS.ENV_BACKGROUND_ANIM,
      `assets/environment/${environmentName}/spritesheet.png`,
      { frameWidth: 720, frameHeight: 1280 }
    );

    env.image(
      ASSET_KEYS.ENV_COLLISION_TILES,
      `assets/environment/${environmentName}/tileset.png`
    );

    env.tilemapTiledJSON(
      ASSET_KEYS.ENV_COLLISION_MAP,
      `assets/environment/${environmentName}/tilemap.json`
    );
  }

  static loadCharacters(
    scene: Scene,
    charactersNameList: CharacterType[]
  ): void {
    const env = scene.load;

    charactersNameList.forEach((name) => {
      env.atlas(
        `${CHARACTER_NAME_TO_KEY[name]}`,
        `assets/characters/${name}/texture.png`,
        `assets/characters/${name}/texture.json`
      );
    });
  }
}
