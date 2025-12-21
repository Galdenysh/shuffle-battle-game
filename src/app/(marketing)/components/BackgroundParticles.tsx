'use client';

import React, { memo } from 'react';
import { SparklesCore } from '@/components/ui';

export const BackgroundParticles = memo(function BackgroundParticles() {
  return (
    <SparklesCore
      background="transparent"
      minSize={0.6}
      maxSize={1.2}
      particleDensity={80}
      className="absolute inset-0 w-full h-full pointer-events-none"
      particleColor="#FFFFFF"
    />
  );
});
