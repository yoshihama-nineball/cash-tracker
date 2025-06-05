import { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿アプリ - ログイン",
  description: "家計簿アプリ - ログイン画面",
};
export default function loginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
