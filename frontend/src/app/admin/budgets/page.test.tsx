import BudgetList from "@/components/budgets/BudgetList";
import { render, screen } from "@testing-library/react";
import BudgetsPage from "./page";

// CreateBudgetFormをモック
jest.mock("@/components/budgets/CreateBudgetForm", () => {
  return jest.fn(() => <div data-testid="get-budget-list" />);
});

describe("BudgetsPage", () => {
  it("BudgetListをレンダリングすること", () => {
    render(<BudgetsPage />);

    expect(screen.getByTestId("get-budget-list")).toBeInTheDocument();
    expect(BudgetList).toHaveBeenCalled();
  });
});
