'use client';

import { useEffect } from 'react';
import type { FC } from 'react';
import bridge from '@vkontakte/vk-bridge';

const VKProvider: FC = () => {
  useEffect(() => {
    const isVk = bridge.isEmbedded();

    if (isVk) {
      bridge.send('VKWebAppInit');
    }
  }, []);

  return null;
};

VKProvider.displayName = 'VKProvider';

export default VKProvider;
