'use client';

import theme from '@/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'キャッシュトラッカー',
  description: '家計簿管理アプリ',
  icons: {
    icon: '/path-to-your-icon.png', // publicフォルダ内のパス
    // 複数のサイズも指定できます
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}