'use client';

import React from 'react';
import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const GameInfo: FC = () => {
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player') || 'Игрок';

  return (
    <div
      className={cn(
        'absolute top-1 left-1 z-50 px-1.5 py-1.5 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-sm text-purple-300/90 font-mono text-xs shadow-[0_0_4px_rgba(147,51,234,0.15)] flex items-center gap-1.5 min-w-fit'
      )}
    >
      <div className="flex items-center gap-1">
        <span className="text-purple-400/80 text-[10px]">PL:</span>
        <span className="text-purple-100/90 text-xs font-medium truncate max-w-[80px]">
          {playerName.slice(0, 10)}
          {playerName.length > 10 ? '...' : ''}
        </span>
      </div>
      <div className="h-3 w-px bg-purple-600/50" />
      <button
        onClick={() => (window.location.href = '/')}
        className={cn(
          'px-2 py-0.5 min-h-8 bg-gray-900/70 backdrop-blur-xs border border-purple-500/30 rounded-sm text-purple-300 font-mono text-[10px] cursor-pointer transition-all duration-150',
          'hover:text-purple-200 hover:border-purple-400/70 hover:bg-purple-900/30',
          'active:scale-95',
          'focus-visible:outline-none focus-visible:border-purple-600/70'
        )}
        title="Выйти в меню"
      >
        EXIT
      </button>
    </div>
  );
};

GameInfo.displayName = 'GameInfo';

export default GameInfo;