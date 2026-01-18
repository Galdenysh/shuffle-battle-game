import { ReactNode } from 'react';
import { VKProvider } from './components';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VKProvider />
      <main className="h-full w-full bg-black overflow-y-auto overscroll-none">
        {children}
      </main>
    </>
  );
}
