// components/budgets/BudgetList.test.tsx
import { render, screen } from "@testing-library/react";
import BudgetList from "./BudgetList";

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

const mockHandleSubmit = jest.fn((cb) => (e) => {
  e?.preventDefault?.();
  cb({ name: "Test Budget", amount: 1000 });
  return true;
});

jest.mock("../../../actions/get-budgets-action.ts", () => ({
  getUserBudgets: jest.fn(() =>
    Promise.resolve({ errors: [], success: "Success" }),
  ),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
  };
});

describe("BudgetListコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("BudgetListコンポーネントが正しくレンダリングされること", () => {
    // テスト用のデータを準備
    const mockBudgets = {
      budgets: [
        {
          id: 1,
          name: "食費",
          amount: 30000,
          createdAt: "2023-04-22T00:00:00.000Z",
          expenseCount: 0,
        },
        {
          id: 2,
          name: "家賃",
          amount: 80000,
          createdAt: "2023-04-23T00:00:00.000Z",
          expenseCount: 0,
        },
      ],
    };

    // propsを渡してレンダリング
    render(<BudgetList budgets={mockBudgets} />);

    // 予算項目が表示されていることを確認
    expect(screen.getByText("食費")).toBeInTheDocument();
    expect(screen.getByText("¥30,000")).toBeInTheDocument();
    expect(screen.getByText("家賃")).toBeInTheDocument();
    expect(screen.getByText("¥80,000")).toBeInTheDocument();

    // アクションボタンが表示されていることを確認
    const editButtons = screen.getAllByRole("button", { name: /編集/i });
    const expenseButtons = screen.getAllByRole("button", { name: /支出管理/i });

    expect(editButtons.length).toBe(2); // 各予算項目に対して1つのボタン
    expect(expenseButtons.length).toBe(2); // 各予算項目に対して1つのボタン
  });

  it("予算がない場合は適切なメッセージとボタンが表示されること", () => {
    // 空の予算データでレンダリング
    render(<BudgetList budgets={{ budgets: [] }} />);

    // 実際のメッセージとボタンでテスト
    expect(
      screen.getByText("予算がまだ登録されていません"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "最初の予算を作成する" }),
    ).toBeInTheDocument();
  });
});
