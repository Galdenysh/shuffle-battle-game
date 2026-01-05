'use client';

import { EventBus } from '@/game/core';
import StartGame from '@/game/main';
import {
  CurrentSceneReadyEvent,
  EmitEvents,
  SceneVisibleEvent,
} from '@/types/events';
import type { Game, Scene } from 'phaser';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

export type RefPhaserGame = {
  game: Game | null;
  scene: Scene | null;
};

interface PhaserGameProps {
  currentActiveScene?: (scene_instance: Scene) => void;
  onReady?: (ready: boolean) => void;
}

const PhaserGame = forwardRef<RefPhaserGame, PhaserGameProps>(
  function PhaserGame({ currentActiveScene, onReady }, ref) {
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

      const handleVisible = ({ isVisible }: SceneVisibleEvent['data']) => {
        if (isVisible) {
          container.classList.remove('opacity-0', 'pointer-events-none');
          container.classList.add('opacity-100', 'pointer-events-auto');
        } else {
          container.classList.remove('opacity-100', 'pointer-events-auto');
          container.classList.add('opacity-0', 'pointer-events-none');
        }
      };

      EventBus.once(EmitEvents.SCENE_VISIBLE, handleVisible);

      return () => {
        EventBus.off(EmitEvents.SCENE_VISIBLE, handleVisible);
      };
    }, []);

    // Обработка current-scene-ready
    useEffect(() => {
      const handleSceneReady = ({ scene }: CurrentSceneReadyEvent['data']) => {
        if (currentActiveScene && typeof currentActiveScene === 'function') {
          currentActiveScene(scene);
        }

        if (typeof ref === 'function') {
          ref({ game: gameRef.current, scene });
        } else if (ref) {
          ref.current = { game: gameRef.current, scene };
        }
      };

      EventBus.once(EmitEvents.CURRENT_SCENE_READY, handleSceneReady);

      return () => {
        EventBus.off(EmitEvents.CURRENT_SCENE_READY, handleSceneReady);
      };
    }, [currentActiveScene, ref]);

    useEffect(() => {
      let rafId1: number;
      let rafId2: number;

      rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          onReady?.(true);
        });
      });

      return () => {
        cancelAnimationFrame(rafId1);
        cancelAnimationFrame(rafId2);

        onReady?.(false);
      };
    }, [onReady]);

    return (
      <div
        id="phaser-game"
        className="z-10 opacity-0 transition-opacity duration-300 pointer-events-none"
        ref={containerRef}
      ></div>
    );
  }
);

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
