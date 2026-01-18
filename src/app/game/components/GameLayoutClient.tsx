'use client';

import { useEffect, useRef } from 'react';
import type { FC, ReactNode } from 'react';

const GameLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Блокируем стандартные жесты
  useEffect(() => {
    if (!rootRef.current) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
    };

    rootRef.current.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });

    return () => {
      if (!rootRef.current) return;

      rootRef.current.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div className="h-full w-full bg-black no-scroll no-select" ref={rootRef}>
      {children}
    </div>
  );
};

GameLayoutClient.displayName = 'GameLayoutClient';

export default GameLayoutClient;
