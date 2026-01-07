import { Game } from 'phaser';
import type { Types } from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from './constants';
import { config } from './config';

const StartGame = (parent: Types.Core.GameConfig['parent']) => {
  // Определите плотность пикселей устройства
  const dpr = window.devicePixelRatio || 1;

  const baseWidth = (config.width as number) || BASE_WIDTH;
  const baseHeight = (config.height as number) || BASE_HEIGHT;

  const finalConfig = {
    ...config,
    parent,
    width: Math.floor(baseWidth * dpr),
    height: Math.floor(baseHeight * dpr),
    scale: {
      ...config.scale,
      zoom: dpr > 1 ? 1 / dpr : 1,
    },
  };

  return new Game(finalConfig);
};

export default StartGame;
