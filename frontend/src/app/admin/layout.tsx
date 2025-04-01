import { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿アプリ - 管理画面",
  description: "家計簿アプリの管理画面です",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
