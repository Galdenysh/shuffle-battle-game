import React, { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <header></header> */}
      <main>{children}</main>
      {/* <footer></footer> */}
    </>
  );
}
