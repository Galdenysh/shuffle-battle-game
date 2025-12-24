'use client';

import { EventBus } from '@/game/EventBus';
import StartGame from '@/game/main';
import type { Game, Scene } from 'phaser';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

export type RefPhaserGame = {
  game: Game | null;
  scene: Scene | null;
};

type PhaserGameProps = {
  currentActiveScene?: (scene_instance: Scene) => void;
};

const PhaserGame = forwardRef<RefPhaserGame, PhaserGameProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const gameRef = useRef<Game | null>(null!);

    useLayoutEffect(() => {
      if (gameRef.current === null) {
        gameRef.current = StartGame('phaser-game');

        if (typeof ref === 'function') {
          ref({ game: gameRef.current, scene: null });
        } else if (ref) {
          ref.current = { game: gameRef.current, scene: null };
        }
      }

      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);

          if (gameRef.current !== null) {
            gameRef.current = null;
          }
        }
      };
    }, [ref]);

    useEffect(() => {
      EventBus.on('current-scene-ready', (scene_instance: Scene) => {
        if (currentActiveScene && typeof currentActiveScene === 'function') {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === 'function') {
          ref({ game: gameRef.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: gameRef.current, scene: scene_instance };
        }
      });

      return () => {
        EventBus.removeListener('current-scene-ready');
      };
    }, [currentActiveScene, ref]);

    return (
      <div
        id="phaser-game"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      ></div>
    );
  }
);

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
