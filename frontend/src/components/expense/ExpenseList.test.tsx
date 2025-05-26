import { render, screen } from "@testing-library/react";
import ExpenseList from "./ExpenseList";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useState: jest.fn(),
  };
});

const { useState } = require("react");

describe("ExpenseListコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    let callCount = 0;
    useState.mockImplementation((initialValue) => {
      callCount++;
      if (callCount === 1) {
        return ["name", jest.fn()];
      } else if (callCount === 2) {
        return ["asc", jest.fn()];
      }
      return [initialValue, jest.fn()];
    });
  });

  const mockBudget = {
    id: 1,
    name: "食費",
    amount: 30000,
    createdAt: "2023-04-22T00:00:00.000Z",
    updatedAt: "2023-04-22T00:00:00.000Z",
    userId: 12137193,
    expenses: [
      {
        _id: "exp1",
        name: "ほうれん草",
        amount: 200,
        createdAt: "2023-04-22T00:00:00.000Z",
        budget: 1,
        budgetId: 1,
      },
      {
        _id: "exp2",
        name: "オートミール",
        amount: 500,
        createdAt: "2023-04-23T00:00:00.000Z",
        budget: 1,
        budgetId: 1,
      },
    ],
  };

  it("budgetがundefinedの場合、エラーメッセージが表示されること", () => {
    render(<ExpenseList />);
    expect(screen.getByText("予算データが見つかりません")).toBeInTheDocument();
  });

  it("ExpenseListコンポーネントが正しくレンダリングされること", () => {
    render(<ExpenseList budget={mockBudget} />);

    expect(screen.getByText("支出一覧 (2件)")).toBeInTheDocument();
    expect(screen.getByText("ほうれん草")).toBeInTheDocument();
    expect(screen.getByText("¥200")).toBeInTheDocument();
    expect(screen.getByText("オートミール")).toBeInTheDocument();
    expect(screen.getByText("¥500")).toBeInTheDocument();
    expect(
      screen.getByText("予算の使用率グラフ表示コンポーネント"),
    ).toBeInTheDocument();
  });

  it("支出がない場合の表示が正しいこと", () => {
    const mockBudgetWithoutExpenses = {
      ...mockBudget,
      expenses: [],
    };

    render(<ExpenseList budget={mockBudgetWithoutExpenses} />);

    expect(screen.getByText("支出一覧 (0件)")).toBeInTheDocument();
    expect(screen.getByText("まだ支出がありません")).toBeInTheDocument();
  });

  it("テーブルのヘッダーが正しく表示されること", () => {
    render(<ExpenseList budget={mockBudget} />);

    expect(screen.getByText("支出名")).toBeInTheDocument();
    expect(screen.getByText("金額")).toBeInTheDocument();
    expect(screen.getByText("作成日")).toBeInTheDocument();
    expect(screen.getByText("アクション")).toBeInTheDocument();
  });

  it("作成日が正しい形式で表示されること", () => {
    render(<ExpenseList budget={mockBudget} />);

    expect(screen.getByText("2023/4/22")).toBeInTheDocument();
    expect(screen.getByText("2023/4/23")).toBeInTheDocument();
  });

  it("金額がカンマ区切りで表示されること", () => {
    const mockBudgetWithLargeAmount = {
      ...mockBudget,
      expenses: [
        {
          _id: "exp1",
          name: "高額商品",
          amount: 12345,
          createdAt: "2023-04-22T00:00:00.000Z",
          budget: 1,
          budgetId: 1,
        },
      ],
    };

    render(<ExpenseList budget={mockBudgetWithLargeAmount} />);
    expect(screen.getByText("¥12,345")).toBeInTheDocument();
  });

  it("アクションカラムにアイコンが表示されること", () => {
    render(<ExpenseList budget={mockBudget} />);

    const actionIcons = screen.getAllByText("🔧");
    expect(actionIcons).toHaveLength(2);
  });

  it("expensesプロパティがundefinedでもエラーにならないこと", () => {
    const mockBudgetWithoutExpensesProperty = {
      ...mockBudget,
      expenses: undefined,
    };

    render(<ExpenseList budget={mockBudgetWithoutExpensesProperty} />);
    expect(screen.getByText("支出一覧 (0件)")).toBeInTheDocument();
  });

  it("単一の支出が正しく表示されること", () => {
    const mockBudgetWithSingleExpense = {
      ...mockBudget,
      expenses: [
        {
          _id: "exp1",
          name: "電車代",
          amount: 300,
          createdAt: "2023-04-22T00:00:00.000Z",
          budget: 1,
          budgetId: 1,
        },
      ],
    };

    render(<ExpenseList budget={mockBudgetWithSingleExpense} />);

    expect(screen.getByText("支出一覧 (1件)")).toBeInTheDocument();
    expect(screen.getByText("電車代")).toBeInTheDocument();
    expect(screen.getByText("¥300")).toBeInTheDocument();
  });
});
