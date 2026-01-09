import type { CharacterType } from './entities';

export const BASE_WIDTH = 360;
export const BASE_HEIGHT = 640;

export const ASSET_KEYS = {
  // Environment
  ENV_BACKGROUND: 'background',
  ENV_FOREGROUND: 'foreground',
  ENV_BACKGROUND_ANIM: 'background_anim',
  ENV_COLLISION_TILES: 'collision_tiles',
  ENV_COLLISION_MAP: 'collision_map',

  // Characters
  CHAR_MC_MAN: 'character_mc_man',
  CHAR_SHUFFLER_MAN: 'character_shuffler_man',
} as const;

export const CHARACTER_NAME_TO_KEY: Record<CharacterType, string> = {
  mc_man: ASSET_KEYS.CHAR_MC_MAN,
  shuffler_man: ASSET_KEYS.CHAR_SHUFFLER_MAN,
};
