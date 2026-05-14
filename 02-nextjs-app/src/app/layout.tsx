import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dokploy Next.js 示例',
  description: '部署在 Dokploy 平台上的 Next.js 全栈应用示例',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}