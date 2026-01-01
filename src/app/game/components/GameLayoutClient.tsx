'use client';

import React, { useEffect } from 'react';
import type { FC, ReactNode } from 'react';

const GameLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('no-scroll'); // Блокируем скролл во время игры

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return <div>{children}</div>;
};

GameLayoutClient.displayName = 'GameLayoutClient';

export default GameLayoutClient;
