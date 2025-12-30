'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { RefPhaserGame } from '@/components/PhaserGame';

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <div>Загрузка...</div>,
});

const GameButtons = dynamic(
  () => import('./components').then((mod) => mod.GameButtons),
  {
    ssr: false,
    loading: () => <div>Загрузка...</div>,
  }
);

export default function GamePage() {
  const searchParams = useSearchParams();
  const phaserRef = useRef<RefPhaserGame | null>(null);

  const playerName = searchParams.get('player') || 'Игрок';

  return (
    <div className="game-container">
      <div className="game-ui-overlay">
        <div className="player-info">
          <span className="player-name">Игрок: {playerName}</span>
          <button
            onClick={() => (window.location.href = '/')}
            className="exit-button"
          >
            ← Выйти в меню
          </button>
        </div>
      </div>
      <GameButtons />
      <PhaserGame ref={phaserRef} />
    </div>
  );
}
