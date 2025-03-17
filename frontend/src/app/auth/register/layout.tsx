import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "家計簿アプリ - アカウント作成",
  description: "家計簿アプリ - 新規登録画面"
}
export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
