'use client';

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';

export function GameLayoutClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('no-scroll'); // Блокируем скролл во время игры

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return <div className="game-fullscreen">{children}</div>;
}

