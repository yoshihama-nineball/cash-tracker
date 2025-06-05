// app/layout.tsx
import Header from "@/components/layouts/Header/Header";
import { Metadata } from "next";
import React from "react";
import { MessageProvider } from "../../context/MessageContext";
import { verifySession } from "../../libs/auth/dal";
import Loading from "../components/feedback/Loading";
import { ClientThemeProvider } from "../components/layouts/ClientThemeProvider";

export const metadata: Metadata = {
  title: "家計簿アプリ | TOP",
  description: "家計簿管理アプリ",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await verifySession();

  const userData = {
    user: user,
    isAuth: !!user,
  };

  return (
    <html lang="ja">
      <body>
        <ClientThemeProvider>
          <MessageProvider>
            <Header userData={userData} />
            <main>
              <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
            </main>
          </MessageProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
