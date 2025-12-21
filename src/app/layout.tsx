import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@/styles/globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shuffle Battle | Phaser Game',
  description: 'Танцевальный баттл по шаффлу на Phaser и Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}