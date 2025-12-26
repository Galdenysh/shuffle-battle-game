import React from 'react';

export const metadata = {
  title: 'Shuffle Battle - Танцевальный баттл',
  description: 'Играйте в шаффл на мобильных устройствах',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

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
