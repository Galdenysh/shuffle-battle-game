import type { CharacterType } from './entities';

export const BASE_WIDTH = 720;
export const BASE_HEIGHT = 1280;

export const ASSET_KEYS = {
  // Environment
  ENV_BACKGROUND: 'background',
  ENV_FOREGROUND: 'foreground',
  ENV_BACKGROUND_ANIM: 'background_anim',
  ENV_COLLISION_TILES: 'collision_tiles',
  ENV_COLLISION_MAP: 'collision_map',

  // Audio
  SFX_COMBO_SUCCESS: 'combo_success',
  SFX_HALL_IMPULSE: 'hall_impulse',
  SOUND_BATTLE: 'sound_battle',
  SOUND_BACKGROUND: 'sound_background',

  // Characters
  CHAR_MC_MAN: 'character_mc_man',
  CHAR_SHUFFLER_MAN: 'character_shuffler_man',
} as const;

export const CHARACTER_NAME_TO_KEY: Record<CharacterType, string> = {
  mc_man: ASSET_KEYS.CHAR_MC_MAN,
  shuffler_man: ASSET_KEYS.CHAR_SHUFFLER_MAN,
};
