'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import GameInfo from './GameInfo';
import GameHUD from './GameHUD';
import { useIsTouchDevice } from '@/hooks';

interface GameInterfaceProps {
  onMounted?: (isMounted: boolean) => void;
}

const GameInterface: FC<GameInterfaceProps> = ({ onMounted }) => {
  const [isVisibleGamepad, setIsVisibleGamepad] = useState<boolean>(true);
  const isTouch = useIsTouchDevice();

  const handleVisibleGamepad = (isVisible: boolean) => {
    setIsVisibleGamepad(isVisible);
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
