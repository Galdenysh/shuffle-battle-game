'use client';

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { Game, Scene } from 'phaser';
import { EventBus } from '@/game/core';
import StartGame from '@/game/main';
import { cn } from '@/lib/utils';
import { DEFAULT_VALUES, STORAGE_KEYS } from '@/lib/constants';
import { EmitEvents } from '@/types';
import type { CurrentSceneReadyEvent, SceneVisibleEvent } from '@/types';

export type RefPhaserGame = {
  game: Game | null;
  scene: Scene | null;
};

interface PhaserGameProps {
  currentActiveScene?: (scene_instance: Scene) => void;
  onMounted?: (isMounted: boolean) => void;
  onGameReady?: (isReady: boolean) => void;
}

const PhaserGame = forwardRef<RefPhaserGame, PhaserGameProps>(
  function PhaserGame({ currentActiveScene, onMounted, onGameReady }, ref) {
    const gameRef = useRef<Game | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useLayoutEffect(() => {
      if (gameRef.current === null) {
        const playerName =
          sessionStorage.getItem(STORAGE_KEYS.PLAYER_NAME) ||
          DEFAULT_VALUES.PLAYER_NAME;

        gameRef.current = StartGame('phaser-game', { playerName });

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

      const handleVisible = ({ isVisible }: SceneVisibleEvent['payload']) => {
        setIsVisible(isVisible);

        onGameReady?.(isVisible);
      };

      EventBus.once(EmitEvents.SCENE_VISIBLE, handleVisible);

      return () => {
        EventBus.off(EmitEvents.SCENE_VISIBLE, handleVisible);
      };
    }, [containerRef.current]);

    // Обработка current-scene-ready
    useEffect(() => {
      const handleSceneReady = ({
        scene,
      }: CurrentSceneReadyEvent['payload']) => {
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
      onMounted?.(true);

      return () => {
        onMounted?.(false);
      };
    }, [onMounted]);

    return (
      <div
        id="phaser-game"
        className={cn(
          'h-full w-full z-10 transition-opacity duration-300',
          isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        ref={containerRef}
      ></div>
    );
  }
);

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
