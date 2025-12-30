'use client';

import { EMIT_EVENT } from '@/game/constants';
import { EventBus } from '@/game/core';
import StartGame from '@/game/main';
import type { Game, Scene } from 'phaser';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

export type RefPhaserGame = {
  game: Game | null;
  scene: Scene | null;
};

interface PhaserGameProps {
  currentActiveScene?: (scene_instance: Scene) => void;
}

const PhaserGame = forwardRef<RefPhaserGame, PhaserGameProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const gameRef = useRef<Game | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
          EventBus.removeAllListeners();

          gameRef.current.destroy(true);

          if (gameRef.current !== null) {
            gameRef.current = null;
          }
        }
      };
    }, [ref]);

    // Обработка scene-visible
    useEffect(() => {
      const container = containerRef.current;

      if (!container) return;

      EventBus.once(EMIT_EVENT.SCENE_VISIBLE, () => {
        container.classList.remove('opacity-0', 'pointer-events-none');
        container.classList.add('opacity-100', 'pointer-events-auto');
      });
    }, []);

    // Обработка current-scene-ready
    useEffect(() => {
      EventBus.once(EMIT_EVENT.CURRENT_SCENE_READY, (scene_instance: Scene) => {
        if (currentActiveScene && typeof currentActiveScene === 'function') {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === 'function') {
          ref({ game: gameRef.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: gameRef.current, scene: scene_instance };
        }
      });
    }, [currentActiveScene, ref]);

    return (
      <div
        id="phaser-game"
        className="opacity-0 transition-opacity duration-300 pointer-events-none"
        ref={containerRef}
      ></div>
    );
  }
);

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
