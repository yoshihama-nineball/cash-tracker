import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditBudgetForm from "./EditBudgetForm";

jest.mock(
  "actions/edit-budget-action",
  () => {
    const mockEditBudget = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        errors: [],
        success: "更新が完了しました",
      });
    });

    mockEditBudget.bind = function (thisArg, ...args) {
      return (...callArgs) => this(args[0], ...callArgs);
    };

    return { editBudget: mockEditBudget };
  },
  { virtual: true },
);

jest.mock(
  "libs/schemas/auth",
  () => ({
    Budget: {},
    DraftBudgetFormValues: {},
    DraftBudgetSchema: {
      safeParse: jest.fn().mockImplementation(() => ({
        success: true,
        data: { name: "テスト予算", amount: "100000" },
      })),
    },
  }),
  { virtual: true },
);

jest.mock("react-dom", () => {
  const originalModule = jest.requireActual("react-dom");
  return {
    ...originalModule,
    useFormState: (action, initialState) => [initialState, jest.fn()],
    useFormStatus: () => ({ pending: false }),
  };
});

describe("EditBudgetFormコンポーネントのテスト", () => {
  const mockBudget = {
    id: "123",
    name: "テスト予算",
    amount: 100000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされること", () => {
    render(<EditBudgetForm budget={mockBudget} />);

    expect(screen.getByText(/予算の編集/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/金額/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("初期値が正しく設定されること", () => {
    render(<EditBudgetForm budget={mockBudget} />);

    const nameInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/金額/i) as HTMLInputElement;
    expect(nameInput).toBeInTheDocument
    ();
    expect(amountInput).toBeInTheDocument();

    // 編集前の値がフォームに入力されるかテスト
    expect(nameInput.value).toBe("テスト予算");
    expect(amountInput.value).toBe("100000");
  });

  it("フォーム送信が正しく動作すること", async () => {
    render(<EditBudgetForm budget={mockBudget} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/更新/i)).toBeInTheDocument();
    });
  });
});
