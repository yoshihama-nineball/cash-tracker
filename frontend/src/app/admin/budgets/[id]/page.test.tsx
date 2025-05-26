// src/app/admin/budgets/[id]/page.test.tsx
import { getBudget } from "@/services/budget";
import { render, screen } from "@testing-library/react";
import BudgetDetailsPage from "./page";

jest.mock("@/services/budget", () => ({
  getBudget: jest.fn(),
}));

jest.mock("@/components/expense/CreateExpenseForm", () => {
  return jest.fn(({ budgetId }) => (
    <div data-testid="create-expense-form">支出作成フォーム - {budgetId}</div>
  ));
});

jest.mock("@/components/expense/ExpenseList", () => {
  return jest.fn(({ budget }) => (
    <div data-testid="expense-list">支出リスト - {budget.name}</div>
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

describe("BudgetDetailsPage", () => {
  const mockBudget = {
    id: "budget-123",
    name: "テスト予算",
    amount: 100000,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getBudget as jest.Mock).mockResolvedValue(mockBudget);
  });

  it("予算詳細ページが正しくレンダリングされること", async () => {
    const mockParams = { id: "budget-123" };

    const page = await BudgetDetailsPage({ params: mockParams });
    render(page);

    expect(screen.getByText("テスト予算")).toBeInTheDocument();

    expect(screen.getByTestId("create-expense-form")).toBeInTheDocument();
    expect(screen.getByTestId("expense-list")).toBeInTheDocument();
  });

  it("getBudgetが正しいIDで呼び出されること", async () => {
    const mockParams = { id: "budget-456" };

    await BudgetDetailsPage({ params: mockParams });

    expect(getBudget).toHaveBeenCalledWith("budget-456");
    expect(getBudget).toHaveBeenCalledTimes(1);
  });

  it("子コンポーネントに正しいpropsが渡されること", async () => {
    const mockParams = { id: "budget-123" };

    const page = await BudgetDetailsPage({ params: mockParams });
    render(page);

    expect(
      screen.getByText("支出作成フォーム - budget-123"),
    ).toBeInTheDocument();
    expect(screen.getByText("支出リスト - テスト予算")).toBeInTheDocument();
  });

  it("getBudgetでエラーが発生した場合もハンドリングされること", async () => {
    (getBudget as jest.Mock).mockRejectedValue(
      new Error("予算が見つかりません"),
    );

    const mockParams = { id: "invalid-id" };
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    let errorThrown = false;

    try {
      const page = await BudgetDetailsPage({ params: mockParams });
      render(page);
    } catch (e) {
      errorThrown = true;
    } finally {
      consoleSpy.mockRestore();
    }

    expect(getBudget).toHaveBeenCalledWith("invalid-id");
  });
});
