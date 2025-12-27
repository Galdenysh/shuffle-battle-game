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
  CHAR_NETRUNNER_WOMAN: 'character_netrunner_woman',
  CHAR_NOMAD_MECHANIC_MAN: 'character_nomadmechanic_man',
} as const;

export const CHARACTER_NAME_TO_KEY: Record<CharacterType, string> = {
  netrunner_woman: ASSET_KEYS.CHAR_NETRUNNER_WOMAN,
  nomadmechanic_man: ASSET_KEYS.CHAR_NOMAD_MECHANIC_MAN,
};
