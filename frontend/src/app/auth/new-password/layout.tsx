import { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿アプリ - パスワードのリセット",
  description: "家計簿アプリ - パスワードのリセット",
};
export default function confirmAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
