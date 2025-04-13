import { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿アプリ - 予算の作成",
  description: "家計簿アプリの予算作成画面です",
};

export default async function NewBudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
