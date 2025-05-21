import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMessage } from "../../../context/MessageContext";
import DeleteDialog from "./DeleteDialog";

jest.mock("../../../context/MessageContext", () => ({
  useMessage: jest.fn(() => ({
    showMessage: jest.fn(),
  })),
}));

jest.mock(
  "../../../actions/delete-budget-actions",
  () => {
    const mockDeleteBudget = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        errors: [],
        success: "テスト予算を削除しました",
      });
    });

    mockDeleteBudget.bind = function (thisArg, ...args) {
      return (...callArgs) => this(args[0], ...callArgs);
    };

    return { deleteBudget: mockDeleteBudget };
  },
  { virtual: true },
);

// React のuseActionStateをモック
jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
  };
});

describe("DeleteDialogコンポーネントのテスト", () => {
  const mockShowMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMessage as jest.Mock).mockImplementation(() => ({
      showMessage: mockShowMessage,
    }));
  });

  it("削除ボタンが正しくレンダリングされること", () => {
    const mockIsMobile = false;
    const mockBudgetId = "123";
    const mockBudgetName = "テスト予算";

    render(
      <DeleteDialog
        isMobile={mockIsMobile}
        budgetId={mockBudgetId}
        budgetName={mockBudgetName}
      />,
    );
    expect(screen.getByRole("button", { name: /削除/i })).toBeInTheDocument();
  });

  it("削除ボタンをクリックするとダイアログが表示されること", () => {
    const mockIsMobile = false;
    const mockBudgetId = "123";
    const mockBudgetName = "テスト予算";

    render(
      <DeleteDialog
        isMobile={mockIsMobile}
        budgetId={mockBudgetId}
        budgetName={mockBudgetName}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /削除/i });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(screen.getByText("予算は完全に削除されます")).toBeInTheDocument();
    expect(
      screen.getByText(`「${mockBudgetName}」を削除しますか？`),
    ).toBeInTheDocument();
  });

  it("削除確認ダイアログで削除ボタンをクリックすると削除処理が実行されること", async () => {
    const mockIsMobile = false;
    const mockBudgetId = "123";
    const mockBudgetName = "テスト予算";

    render(
      <DeleteDialog
        isMobile={mockIsMobile}
        budgetId={mockBudgetId}
        budgetName={mockBudgetName}
      />,
    );

    const initialDeleteButton = screen.getByRole("button", { name: /削除/i });
    fireEvent.click(initialDeleteButton);

    // ダイアログ内の削除ボタンを探す
    const dialogDeleteButton = screen.getByRole("button", { name: /^削除$/i });
    expect(dialogDeleteButton).toBeInTheDocument();

    // ダイアログ内の削除ボタンをクリック
    fireEvent.click(dialogDeleteButton);

    expect(mockShowMessage).toHaveBeenCalledWith(
      `「${mockBudgetName}」を削除しました`,
      "success",
    );
  });

  it("キャンセルボタンをクリックするとダイアログが閉じること", async () => {
    const mockIsMobile = false;
    const mockBudgetId = "123";
    const mockBudgetName = "テスト予算";

    render(
      <DeleteDialog
        isMobile={mockIsMobile}
        budgetId={mockBudgetId}
        budgetName={mockBudgetName}
      />,
    );

    const initialDeleteButton = screen.getByRole("button", { name: /削除/i });
    fireEvent.click(initialDeleteButton);

    const dialogTitle = screen.getByText(
      `「${mockBudgetName}」を削除しますか？`,
    );
    expect(dialogTitle).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /キャンセル/i });
    fireEvent.click(cancelButton);

    // ダイアログが非表示になることを確認
    await waitFor(() => {
      const dialogContainer = document.querySelector(".MuiDialog-root");
      expect(dialogContainer).toHaveClass("MuiModal-hidden");
    });
  });
});
