'use client';

import type { FC } from 'react';
import { PhoneIcon } from './ui';
import { cn } from '@/lib/utils';

const OrientationLock: FC = () => {
  return (
    <div
      className={cn(
        'hidden fixed inset-0 flex-col items-center justify-center p-6 z-9999',
        'bg-black text-white',
        '[@media(pointer:coarse)]:landscape:flex'
      )}
      aria-hidden={true}
    >
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <PhoneIcon className="w-12 h-12 animate-bounce" />
        </div>
        <p className="text-lg font-bold tracking-tight">
          Пожалуйста, верните телефон в портретный режим
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Игра поддерживает только вертикальную ориентацию
        </p>
      </div>
    </div>
  );
};

OrientationLock.displayName = 'OrientationLock';

export default OrientationLock;
