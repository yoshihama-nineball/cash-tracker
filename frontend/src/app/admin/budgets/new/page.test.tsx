import CreateBudgetForm from "@/components/budgets/CreateBudgetForm";
import { render, screen } from "@testing-library/react";
import CreateBudgetPage from "./page";

// CreateBudgetFormをモック
jest.mock("@/components/budgets/CreateBudgetForm", () => {
  return jest.fn(() => <div data-testid="create-budget-form" />);
});

describe("CreateBudgetPage", () => {
  it("CreateBudgetFormをレンダリングすること", () => {
    render(<CreateBudgetPage />);

    expect(screen.getByTestId("create-budget-form")).toBeInTheDocument();
    expect(CreateBudgetForm).toHaveBeenCalled();
  });
});
