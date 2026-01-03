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

  // Если это двойной тап — блокируем стандартное поведение
  useEffect(() => {
    let lastTap = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const now = Date.now();
      const DOUBLE_TAP_THRESHOLD = 300;

      if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
        if (e.cancelable) e.preventDefault();
      }

      lastTap = now;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <div>{children}</div>;
};

GameLayoutClient.displayName = 'GameLayoutClient';

export default GameLayoutClient;
