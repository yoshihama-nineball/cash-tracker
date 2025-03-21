import { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿アプリ - アカウントの有効化",
  description: "家計簿アプリ - アカウントの有効化",
};
export default function confirmAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
