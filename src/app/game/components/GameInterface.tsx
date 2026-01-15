'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import GameInfo from './GameInfo';
import GameHUD from './GameHUD';
import { useIsTouchDevice } from '@/hooks';

interface GameInterfaceProps {
  onReady?: (ready: boolean) => void;
}

const GameInterface: FC<GameInterfaceProps> = ({ onReady }) => {
  const [isVisibleGamepad, setIsVisibleGamepad] = useState<boolean>(true);
  const isTouch = useIsTouchDevice();

  const handleVisibleGamepad = (isVisible: boolean) => {
    setIsVisibleGamepad(isVisible);
  };

  useEffect(() => {
    onReady?.(true);

    return () => {
      onReady?.(false);
    };
  }, [onReady]);

  useEffect(() => {
    setIsVisibleGamepad(isTouch);
  }, [isTouch]);

  return (
    <>
      <GameInfo
        isVisibleGamepad={isVisibleGamepad}
        onVisibleGamepad={handleVisibleGamepad}
      />
      <GameHUD isVisibleGamepad={isVisibleGamepad} />
    </>
  );
};

GameInterface.displayName = 'GameInterface';

export default GameInterface;
