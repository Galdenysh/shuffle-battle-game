import { MainScene } from './scenes';
import { AUTO, Game, Scale } from 'phaser';
import type { Types } from 'phaser';

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 390,
  height: 844,
  parent: 'phaser-game',
  scene: [MainScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};

const StartGame = (parent: Types.Core.GameConfig['parent']) => {
  return new Game({ ...config, parent });
};

export default StartGame;
