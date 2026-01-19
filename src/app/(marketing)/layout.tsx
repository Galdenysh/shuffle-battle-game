import { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="h-full w-full bg-black overflow-y-auto overscroll-none">
        {children}
      </main>
    </>
  );
}
