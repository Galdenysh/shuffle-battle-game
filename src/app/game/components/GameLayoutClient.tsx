'use client';

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';

export function GameLayoutClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Блокируем скролл во время игры

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return <div className="game-fullscreen">{children}</div>;
}

