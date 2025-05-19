// app/layout.tsx
// server component
import Loading from "@/components/feedback/Loading";
import { ClientThemeProvider } from "@/components/layouts/ClientThemeProvider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "家計簿アプリ | 予算一覧",
  description: "予算情報の一覧を閲覧できるページ",
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
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </main>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
