// app/layout.tsx
// server component
import FlashMessage from "@/components/feedback/Alert/FlashMessage";
import { ClientThemeProvider } from "@/components/layouts/ClientThemeProvider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "家計簿アプリ | ユーザ設定",
  description: "ユーザ情報を閲覧・編集できるページ",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ClientThemeProvider>
          <main>
            <FlashMessage />
            <React.Suspense>{children}</React.Suspense>
          </main>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
