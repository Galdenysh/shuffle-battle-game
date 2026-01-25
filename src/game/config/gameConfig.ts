import { AUTO, Scale, Types } from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from '../constants';
import { MainScene } from '../scenes';

export const config: Types.Core.GameConfig = {
  title: 'Shuffle Battle',
  banner: process.env.NODE_ENV === 'development',

  type: AUTO,

  width: BASE_WIDTH,
  height: BASE_HEIGHT,

  parent: 'phaser-game',
  scene: [MainScene],

  backgroundColor: '#1a1a2e',

  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    expandParent: false,
    zoom: 1,
  },

  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    powerPreference: 'high-performance',
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
      timeScale: 1,
      overlapBias: 4,
    },
  },

  fps: {
    target: 60,
    forceSetTimeOut: false,
    smoothStep: false,
  },

  input: {
    activePointers: 3,
    touch: {
      capture: true,
    },
    keyboard: true,
  },

  audio: {
    disableWebAudio: false,
    noAudio: false,
  },

  autoRound: true,
};
