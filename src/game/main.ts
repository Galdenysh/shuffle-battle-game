import { Game } from 'phaser';
import type { Types } from 'phaser';
import { config } from './config';
import { STORAGE_KEYS } from '@/lib/constants';

const StartGame = (
  parent: Types.Core.GameConfig['parent'],
  initialData: { playerName: string }
) => {
  const finalConfig: Types.Core.GameConfig = {
    ...config,
    parent,
    callbacks: {
      preBoot: (game) => {
        game.registry.set(STORAGE_KEYS.PLAYER_NAME, initialData.playerName);
      },
    },
  };

  return new Game(finalConfig);
};

export default StartGame;
