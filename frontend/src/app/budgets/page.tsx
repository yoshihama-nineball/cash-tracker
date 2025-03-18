// app/budgets/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { getBudgets } from "../../../libs/api";
import BudgetList from "../../components/budgets/BudgetList";
import BudgetSkeleton from "../../components/budgets/BudgetSkeleton";

export const metadata = {
  title: "予算一覧 | 家計簿アプリ",
  description: "予算の一覧を確認・管理できます",
};

export default async function BudgetsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">予算一覧</h1>
        <Link
          href="/budgets/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          新規予算作成
        </Link>
      </div>

      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetListContainer />
      </Suspense>
    </div>
  );
}

// 非同期データ取得を含む子コンポーネントに分離
async function BudgetListContainer() {
  const budgetsData = await getBudgets();

  return <BudgetList budgets={budgetsData.budgets} />;
}
