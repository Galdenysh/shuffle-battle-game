import { ReactNode } from 'react';
import { VKProvider } from './components';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VKProvider />
      <main className="h-dvh w-full overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </>
  );
}
