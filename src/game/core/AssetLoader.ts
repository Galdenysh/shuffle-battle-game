import type { Scene } from 'phaser';
import type { CharacterType } from '../entities';
import { ASSET_KEYS, CHARACTER_NAME_TO_KEY } from '../constants';
import { v } from '@/lib/utils';

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
    AssetLoader.loadAudio(scene);
  }

  static loadAudio(scene: Scene): void {
    const load = scene.load;

    load.audio(
      ASSET_KEYS.SFX_COMBO_SUCCESS,
      v('assets/audio/sfx/combo_success.mp3')
    );

    load.audio(
      ASSET_KEYS.SFX_HALL_IMPULSE,
      v('assets/audio/sfx/hall_impulse.wav')
    );

    load.audio(ASSET_KEYS.SOUND_BATTLE, v('assets/audio/battle.ogg'));
    load.audio(ASSET_KEYS.SOUND_BACKGROUND, v('assets/audio/background.ogg'));
  }

  static loadEnvironment(scene: Scene, environmentName: string): void {
    const env = scene.load;

    env.image(
      ASSET_KEYS.ENV_BACKGROUND,
      v(`assets/environment/${environmentName}/background.png`)
    );

    env.image(
      ASSET_KEYS.ENV_FOREGROUND,
      v(`assets/environment/${environmentName}/foreground.png`)
    );

    env.spritesheet(
      ASSET_KEYS.ENV_BACKGROUND_ANIM,
      v(`assets/environment/${environmentName}/spritesheet.png`),
      { frameWidth: 720, frameHeight: 1280 }
    );

    env.image(
      ASSET_KEYS.ENV_COLLISION_TILES,
      v(`assets/environment/${environmentName}/tileset.png`)
    );

    env.tilemapTiledJSON(
      ASSET_KEYS.ENV_COLLISION_MAP,
      v(`assets/environment/${environmentName}/tilemap.json`)
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
        v(`assets/characters/${name}/texture.png`),
        v(`assets/characters/${name}/texture.json`)
      );
    });
  }
}
