// app/admin/budgets/page.test.tsx
import { render, screen } from "@testing-library/react";
import { getUserBudgets } from "../../../../actions/get-budgets-action";
import BudgetsPage from "./page";

// getUserBudgetsをモック
jest.mock("../../../../actions/get-budgets-action", () => ({
  getUserBudgets: jest.fn(),
}));

// BudgetListをモック
jest.mock("@/components/budgets/BudgetList", () => {
  return jest.fn(() => (
    <div data-testid="budget-list">モックされた予算リスト</div>
  ));
});

// BudgetSkeletonをモック
jest.mock("@/components/budgets/BudgetSkeleton", () => {
  return jest.fn(() => (
    <div data-testid="budget-skeleton">ローディング中...</div>
  ));
});

// Suspenseをモック
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    Suspense: ({ children }) => children,
  };
});

describe("BudgetsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserBudgets as jest.Mock).mockResolvedValue({
      budgets: [
        { id: 1, name: "食費", amount: 30000 },
        { id: 2, name: "家賃", amount: 80000 },
      ],
    });
  });

  it("予算一覧ページを正しくレンダリングすること", async () => {
    // サーバーコンポーネントは非同期なので、まずコンポーネントをレンダリング
    const page = await BudgetsPage();
    render(page);

    // ページのタイトルが表示されていることを確認
    expect(screen.getByText("予算一覧")).toBeInTheDocument();

    // 新規予算作成ボタンが表示されていることを確認
    expect(screen.getByText("新規予算作成")).toBeInTheDocument();

    // BudgetListコンポーネントが表示されていることを確認
    expect(screen.getByTestId("budget-list")).toBeInTheDocument();
  });

  it("データ取得が正常に行われること", async () => {
    await BudgetsPage();

    // getUserBudgetsが呼び出されたことを確認
    expect(getUserBudgets).toHaveBeenCalledTimes(1);
  });

  it("データ取得でエラーが発生した場合も問題なくレンダリングされること", async () => {
    // エラーをスローするようにモックを設定
    (getUserBudgets as jest.Mock).mockRejectedValue(new Error("API error"));

    // エラーをキャッチして空の予算データを返すようにBudgetsPageを修正した場合のテスト
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    let errorThrown = false;

    try {
      const page = await BudgetsPage();
      render(page);

      // それでもUI要素が表示されていることを確認
      expect(screen.getByText("予算一覧")).toBeInTheDocument();
    } catch {
      // エラーが発生した場合はフラグを立てる
      errorThrown = true;
    } finally {
      consoleSpy.mockRestore();
    }

    // BudgetsPageでエラーハンドリングがされていない場合、このアサーションが失敗する
    expect(errorThrown).toBe(false);
  });
});
