export const metadata = {
  title: 'Shuffle Battle - Танцевальный баттл',
  description: 'Играйте в шаффл на мобильных устройствах',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="marketing-content">{children}</main>
    </>
  );
}
