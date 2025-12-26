import { MainScene } from './scenes';
import { AUTO, Game, Scale } from 'phaser';
import type { Types } from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from './constants';

const config: Types.Core.GameConfig = {
  type: AUTO,

  width: BASE_WIDTH,
  height: BASE_HEIGHT,

  parent: 'phaser-game',
  scene: [MainScene],

  backgroundColor: '#1a1a2e',

  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
    min: { width: BASE_WIDTH, height: BASE_HEIGHT },
    max: { width: BASE_WIDTH * 2, height: BASE_HEIGHT * 2 },
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
      debug: true,
      timeScale: 1,
      overlapBias: 4,
    },
  },

  fps: {
    target: 60,
    forceSetTimeOut: false,
    smoothStep: false,
  },

  //   input: {
  //     activePointers: 3,
  //     touch: {
  //       capture: true,
  //     },
  //     keyboard: false,
  //     gamepad: false,
  //   },

  input: {
    keyboard: true,
  },

  audio: {
    disableWebAudio: false,
    noAudio: false,
  },

  autoRound: true,
};

const StartGame = (parent: Types.Core.GameConfig['parent']) => {
  // const isMobile = typeof window !== 'undefined' &&
  //   /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

    callbacks: {
      postBoot: (game: Game) => {
        if (!parent) return;

        let container: HTMLElement | null = null;

        if (typeof parent === 'string') {
          const element = document.getElementById(parent);

          if (!element) return;

          container = document.getElementById(parent);
        } else {
          container = parent;
        }

        if (!container) return;

        game.events.once('scene-visible', () => {
          container.style.opacity = '1';
          container.style.pointerEvents = 'auto';
        });
      },
    },
  };

  return new Game(finalConfig);
};

export default StartGame;
