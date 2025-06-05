import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
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

jest.mock("../budgets/BudgetChart", () => {
  const MockBudgetChart = () => (
    <div data-testid="budget-chart">予算の使用率グラフ表示コンポーネント</div>
  );
  MockBudgetChart.displayName = "MockBudgetChart";
  return MockBudgetChart;
});

jest.mock("./EditExpenseForm", () => {
  const MockEditExpenseForm = ({ open, expense }) =>
    open === "edit" && expense ? (
      <div data-testid="edit-expense-form">編集フォーム - {expense.name}</div>
    ) : null;
  MockEditExpenseForm.displayName = "MockEditExpenseForm";
  return MockEditExpenseForm;
});

jest.mock("./DeleteExpenseForm", () => {
  const MockDeleteExpenseForm = ({ open, expenseId, expenseName }) =>
    open === "delete" && expenseId && expenseName ? (
      <div data-testid="delete-expense-form">削除フォーム - {expenseName}</div>
    ) : null;
  MockDeleteExpenseForm.displayName = "MockDeleteExpenseForm";
  return MockDeleteExpenseForm;
});

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useState: jest.fn(),
  };
});

describe("ExpenseListコンポーネントのテスト", () => {
  let currentStates = {
    sortField: "name",
    sortDirection: "asc",
    selectedExpenseId: null,
  };

  const mockSetters = {
    setSortField: jest.fn((value) => {
      currentStates.sortField = value;
    }),
    setSortDirection: jest.fn((value) => {
      currentStates.sortDirection = value;
    }),
    setSelectedExpenseId: jest.fn((value) => {
      currentStates.selectedExpenseId = value;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    currentStates = {
      sortField: "name",
      sortDirection: "asc",
      selectedExpenseId: null,
    };

    const mockUseState = React.useState as jest.MockedFunction<
      typeof React.useState
    >;
    mockUseState.mockImplementation((initialValue) => {
      if (initialValue === "name") {
        return [currentStates.sortField, mockSetters.setSortField];
      } else if (initialValue === "asc") {
        return [currentStates.sortDirection, mockSetters.setSortDirection];
      } else if (initialValue === null) {
        return [
          currentStates.selectedExpenseId,
          mockSetters.setSelectedExpenseId,
        ];
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
        id: "expense-1",
        name: "ほうれん草",
        amount: 200,
        createdAt: "2023-04-22T00:00:00.000Z",
        budget: 1,
        budgetId: 1,
      },
      {
        _id: "exp2",
        id: "expense-2",
        name: "オートミール",
        amount: 500,
        createdAt: "2023-04-23T00:00:00.000Z",
        budget: 1,
        budgetId: 1,
      },
    ],
  };

  it("budgetがundefinedの場合、エラーメッセージが表示されること", () => {
    render(<ExpenseList activeModal="none" setActiveModal={jest.fn()} />);
    expect(screen.getByText("予算データが見つかりません")).toBeInTheDocument();
  });

  it("ExpenseListコンポーネントが正しくレンダリングされること", () => {
    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByText("支出一覧 (2件)")).toBeInTheDocument();
    expect(screen.getByText("ほうれん草")).toBeInTheDocument();
    expect(screen.getByText("¥200")).toBeInTheDocument();
    expect(screen.getByText("オートミール")).toBeInTheDocument();
    expect(screen.getByText("¥500")).toBeInTheDocument();
    expect(screen.getByTestId("budget-chart")).toBeInTheDocument();
  });

  it("支出がない場合の表示が正しいこと", () => {
    const mockBudgetWithoutExpenses = {
      ...mockBudget,
      expenses: [],
    };

    render(
      <ExpenseList
        budget={mockBudgetWithoutExpenses}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByText("支出一覧 (0件)")).toBeInTheDocument();
    expect(screen.getByText("まだ支出がありません")).toBeInTheDocument();
  });

  it("テーブルのヘッダーが正しく表示されること", () => {
    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByText("支出名")).toBeInTheDocument();
    expect(screen.getByText("金額")).toBeInTheDocument();
    expect(screen.getByText("作成日")).toBeInTheDocument();
    expect(screen.getByText("アクション")).toBeInTheDocument();
  });

  it("作成日が正しい形式で表示されること", () => {
    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByText("2023/4/22")).toBeInTheDocument();
    expect(screen.getByText("2023/4/23")).toBeInTheDocument();
  });

  it("金額がカンマ区切りで表示されること", () => {
    const mockBudgetWithLargeAmount = {
      ...mockBudget,
      expenses: [
        {
          _id: "exp1",
          id: "expense-1",
          name: "高額商品",
          amount: 12345,
          createdAt: "2023-04-22T00:00:00.000Z",
          budget: 1,
          budgetId: 1,
        },
      ],
    };

    render(
      <ExpenseList
        budget={mockBudgetWithLargeAmount}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );
    expect(screen.getByText("¥12,345")).toBeInTheDocument();
  });

  it("編集・削除ボタンが正しく表示されること", () => {
    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    const editButtons = screen.getAllByText("編集");
    const deleteButtons = screen.getAllByText("削除");

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("expensesプロパティがundefinedでもエラーにならないこと", () => {
    const mockBudgetWithoutExpensesProperty = {
      ...mockBudget,
      expenses: undefined,
    };

    render(
      <ExpenseList
        budget={mockBudgetWithoutExpensesProperty}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );
    expect(screen.getByText("支出一覧 (0件)")).toBeInTheDocument();
  });

  it("単一の支出が正しく表示されること", () => {
    const mockBudgetWithSingleExpense = {
      ...mockBudget,
      expenses: [
        {
          _id: "exp1",
          id: "expense-1",
          name: "電車代",
          amount: 300,
          createdAt: "2023-04-22T00:00:00.000Z",
          budget: 1,
          budgetId: 1,
        },
      ],
    };

    render(
      <ExpenseList
        budget={mockBudgetWithSingleExpense}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByText("支出一覧 (1件)")).toBeInTheDocument();
    expect(screen.getByText("電車代")).toBeInTheDocument();
    expect(screen.getByText("¥300")).toBeInTheDocument();
  });

  it("編集ボタンをクリックすると適切な状態変更が行われること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const editButtons = screen.getAllByText("編集");
    fireEvent.click(editButtons[0]);

    expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith("expense-2");
    expect(mockSetActiveModal).toHaveBeenCalledWith("edit");
  });

  it("削除ボタンをクリックすると適切な状態変更が行われること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const deleteButtons = screen.getAllByText("削除");
    fireEvent.click(deleteButtons[0]);

    expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith("expense-2");
    expect(mockSetActiveModal).toHaveBeenCalledWith("delete");
  });

  it("編集モーダルが開いている時、編集フォームが表示されること", () => {
    currentStates.selectedExpenseId = "expense-1";

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="edit"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByTestId("edit-expense-form")).toBeInTheDocument();
    expect(screen.getByText("編集フォーム - ほうれん草")).toBeInTheDocument();
  });

  it("削除モーダルが開いている時、削除フォームが表示されること", () => {
    currentStates.selectedExpenseId = "expense-1";

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="delete"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.getByTestId("delete-expense-form")).toBeInTheDocument();
    expect(screen.getByText("削除フォーム - ほうれん草")).toBeInTheDocument();
  });

  it("selectedExpenseがない場合、フォームが表示されないこと", () => {
    currentStates.selectedExpenseId = null;

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="edit"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("edit-expense-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-expense-form")).not.toBeInTheDocument();
  });

  it("activeModalがnoneの場合、フォームが表示されないこと", () => {
    currentStates.selectedExpenseId = "expense-1";

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("edit-expense-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-expense-form")).not.toBeInTheDocument();
  });

  it("2番目の支出の編集ボタンをクリックすると正しいIDが設定されること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const editButtons = screen.getAllByText("編集");
    fireEvent.click(editButtons[1]);

    expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith("expense-1");
    expect(mockSetActiveModal).toHaveBeenCalledWith("edit");
  });

  it("2番目の支出の削除ボタンをクリックすると正しいIDが設定されること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const deleteButtons = screen.getAllByText("削除");
    fireEvent.click(deleteButtons[1]);

    expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith("expense-1");
    expect(mockSetActiveModal).toHaveBeenCalledWith("delete");
  });

  it("支出がアルファベット順にソートされて表示されること", () => {
    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={jest.fn()}
      />,
    );

    const oatmealElement = screen.getByText("オートミール");
    const spinachElement = screen.getByText("ほうれん草");

    expect(oatmealElement).toBeInTheDocument();
    expect(spinachElement).toBeInTheDocument();

    const allRows = screen.getAllByRole("row");
    let oatmealRowIndex = -1;
    let spinachRowIndex = -1;

    allRows.forEach((row, index) => {
      if (row.textContent?.includes("オートミール")) {
        oatmealRowIndex = index;
      }
      if (row.textContent?.includes("ほうれん草")) {
        spinachRowIndex = index;
      }
    });

    expect(oatmealRowIndex).toBeGreaterThan(-1);
    expect(spinachRowIndex).toBeGreaterThan(-1);
    expect(oatmealRowIndex).toBeLessThan(spinachRowIndex);
  });

  it("オートミールの編集ボタンをクリックすると正しいIDが設定されること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const oatmealRow = screen.getByText("オートミール").closest("tr");
    const editButtons = oatmealRow?.querySelectorAll("button");
    const editButton = editButtons?.[0];

    expect(editButton).toBeTruthy();
    expect(editButton).toHaveTextContent("編集");

    if (editButton) {
      fireEvent.click(editButton);
      expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith(
        "expense-2",
      );
      expect(mockSetActiveModal).toHaveBeenCalledWith("edit");
    }
  });

  it("ほうれん草の削除ボタンをクリックすると正しいIDが設定されること", () => {
    const mockSetActiveModal = jest.fn();

    render(
      <ExpenseList
        budget={mockBudget}
        activeModal="none"
        setActiveModal={mockSetActiveModal}
      />,
    );

    const spinachRow = screen.getByText("ほうれん草").closest("tr");
    const deleteButtons = spinachRow?.querySelectorAll("button");
    const deleteButton = deleteButtons?.[1];

    expect(deleteButton).toBeTruthy();
    expect(deleteButton).toHaveTextContent("削除");

    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockSetters.setSelectedExpenseId).toHaveBeenCalledWith(
        "expense-1",
      );
      expect(mockSetActiveModal).toHaveBeenCalledWith("delete");
    }
  });
});
