// app/layout.tsx
// server component
import Header from '@/components/layouts/Header/Header'
import { Metadata } from 'next'
import React from 'react'
import Loading from '../components/feedback/Loading'
import { ClientThemeProvider } from '../components/layouts/ClientThemeProvider'

export const metadata: Metadata = {
  title: "キャッシュトラッカー",
  description: "家計簿管理アプリ",
  icons: {
    icon: '/icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ClientThemeProvider>
          <Header />
          <main>
            <React.Suspense fallback={<Loading />}>
              {children}
            </React.Suspense>
          </main>
        </ClientThemeProvider>
      </body>
    </html>
  )
}