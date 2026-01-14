'use client';

import React, { useEffect } from 'react';
import type { FC, ReactNode } from 'react';

const GameLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  // Блокируем скролл, жесты и выделения
  useEffect(() => {
    document.body.classList.add('no-scroll');
    document.body.classList.add('no-select');

    return () => {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('no-select');
    };
  }, []);

  // Блокируем стандартные жесты
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <div className="h-dvh w-full">{children}</div>;
};

GameLayoutClient.displayName = 'GameLayoutClient';

export default GameLayoutClient;
