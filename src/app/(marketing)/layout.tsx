import React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <header></header> */}
      <main className="marketing-content">{children}</main>
      {/* <footer></footer> */}
    </>
  );
}
