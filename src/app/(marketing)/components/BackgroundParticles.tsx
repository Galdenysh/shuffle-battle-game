'use client';

import React, { memo } from 'react';
import { SparklesCore } from '@/components/ui';
import { cn } from '@/lib/utils';

const BackgroundParticles = memo(() => {
  return (
    <SparklesCore
      background="transparent"
      minSize={0.3}
      maxSize={0.6}
      particleSize={0.5}
      speed={0.15}
      particleDensity={100}
      className={cn('absolute inset-0 w-full h-full pointer-events-none')}
      particleColor="#00FFFF"
    />
  );
});

BackgroundParticles.displayName = 'BackgroundParticles';

export default BackgroundParticles;
