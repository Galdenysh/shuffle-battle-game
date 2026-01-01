'use client';

import React, { memo } from 'react';
import { SparklesCore } from '@/components/ui';
import { cn } from '@/lib/utils';

const BackgroundParticles = memo(() => {
  return (
    <SparklesCore
      background="transparent"
      minSize={0.6}
      maxSize={1.2}
      particleDensity={80}
      className={cn('absolute inset-0 w-full h-full pointer-events-none')}
      particleColor="#FFFFFF"
    />
  );
});

BackgroundParticles.displayName = 'BackgroundParticles';

export default BackgroundParticles;
