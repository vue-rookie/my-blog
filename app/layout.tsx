import React from 'react';
import './globals.css';
import { AuthProvider } from '@/src/context/AuthContext';
import { Layout } from '@/src/components/Layout';

export const metadata = {
  title: '博客世界',
  description: '一个基于Next.js的全栈博客系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Fira+Code:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-black">
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
