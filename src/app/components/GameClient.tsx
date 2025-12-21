'use client';

import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';

const AppWithoutSSR = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <p>Загрузка игры...</p>
    </div>
  ),
});

export default function GameClient() {
  return <AppWithoutSSR />;
}
