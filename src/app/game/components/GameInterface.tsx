'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { Game, Sound } from 'phaser';
import GameInfo from './GameInfo';
import GameHUD from './GameHUD';
import { useIsTouchDevice } from '@/hooks';

interface GameInterfaceProps {
  gameInstance?: Game | null;
  onMounted?: (isMounted: boolean) => void;
}

const GameInterface: FC<GameInterfaceProps> = ({ gameInstance, onMounted }) => {
  const [isVisibleGamepad, setIsVisibleGamepad] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const isTouch = useIsTouchDevice();

  const handleVisibleGamepad = (isVisible: boolean) => {
    setIsVisibleGamepad(isVisible);
  };

  const handleMuted = () => {
    if (!gameInstance) return;

    const currentMute = gameInstance.sound.mute;

    gameInstance.sound.setMute(!currentMute);
  };

  useEffect(() => {
    onMounted?.(true);

    return () => {
      onMounted?.(false);
    };
  }, [onMounted]);

  useEffect(() => {
    setIsVisibleGamepad(isTouch);
  }, [isTouch]);

  useEffect(() => {
    if (!gameInstance) return;

    const soundManager = gameInstance.sound;

    const syncMuteState = (
      _soundManager: Sound.BaseSoundManager,
      status: boolean
    ) => {
      setIsMuted(status);
    };

    setIsMuted(soundManager.mute);

    soundManager.on('mute', syncMuteState);

    return () => {
      soundManager.off('mute', syncMuteState);
    };
  }, [gameInstance]);

  return (
    <>
      <GameInfo
        isVisibleGamepad={isVisibleGamepad}
        isMuted={isMuted}
        onVisibleGamepad={handleVisibleGamepad}
        onMuted={handleMuted}
      />
      <GameHUD isVisibleGamepad={isVisibleGamepad} />
    </>
  );
};

GameInterface.displayName = 'GameInterface';

export default GameInterface;
