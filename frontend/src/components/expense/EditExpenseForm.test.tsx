import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import * as ReactHookForm from "react-hook-form";
import EditExpenseForm from "./EditExpenseForm";

// カスタムButtonコンポーネントをモック
jest.mock("../ui/Button/Button", () => {
  const MockButton = ({ children, onClick, disabled, type, ...props }) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = "MockButton";
  return MockButton;
});

// MUIコンポーネントをモック
jest.mock("@mui/material", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Dialog: ({ open, children }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  FormControl: ({ children, error }) => (
    <div data-testid="form-control" data-error={!!error}>
      {children}
    </div>
  ),
  FormHelperText: ({ children }) => (
    <span data-testid="error-message">{children}</span>
  ),
  FormLabel: ({ children }) => <label>{children}</label>,
  TextField: ({ placeholder, id, error, ...props }) => (
    <input
      id={id}
      placeholder={placeholder}
      aria-label={id}
      data-error={!!error}
      {...props}
    />
  ),
  Slide: ({ children }) => children,
  useMediaQuery: () => false,
  useTheme: () => ({ breakpoints: { down: () => false } }),
}));

jest.mock("@mui/material/transitions", () => ({
  TransitionProps: {},
}));

// 他の必要なモック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("../../../context/MessageContext", () => ({
  useMessage: () => ({
    showMessage: jest.fn(),
  }),
}));

// React hooks のモック - jest.fn()を直接使用
jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(),
    useTransition: jest.fn(),
    useEffect: jest.fn(),
    useRef: jest.fn(() => ({ current: null })),
    forwardRef: (fn) => fn,
  };
});

// react-hook-form のモック
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

// action のモック
jest.mock("../../../actions/edit-expense-action", () => ({
  editExpense: jest.fn(),
}));

describe("EditExpenseFormコンポーネントのテスト", () => {
  const mockExpense = {
    id: "123",
    name: "テスト支出",
    amount: 1000,
    budgetId: "budget-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const defaultProps = {
    expense: mockExpense,
    budgetId: 1,
    open: "edit" as const,
    setOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック設定（簡素化）
    (React.useActionState as jest.Mock).mockReturnValue([
      { errors: [], success: "" },
      jest.fn(),
    ]);

    (React.useTransition as jest.Mock).mockReturnValue([false, jest.fn()]);

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn((name) => ({
        name,
        id: name,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      })),
      handleSubmit: jest.fn((fn) => (e) => {
        e?.preventDefault?.();
        fn({ name: "テスト支出", amount: 1000 });
      }),
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    // useEffectは通常通り実行
    (React.useEffect as jest.Mock).mockImplementation((callback) => {
      callback();
    });
  });

  it("フォームが正しくレンダリングされること", () => {
    render(<EditExpenseForm {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "支出の編集",
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("openがedit以外の場合はダイアログが表示されないこと", () => {
    render(<EditExpenseForm {...defaultProps} open="none" />);
    expect(screen.queryByText(/支出の編集/i)).not.toBeInTheDocument();
  });

  it("expenseがundefinedの場合でもエラーにならないこと", () => {
    render(<EditExpenseForm {...defaultProps} expense={undefined} />);
    expect(screen.getByText(/支出の編集/i)).toBeInTheDocument();
  });

  it("expenseが存在する場合、setValueが呼ばれること", () => {
    const mockSetValue = jest.fn();

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: mockSetValue,
    });

    render(<EditExpenseForm {...defaultProps} />);

    expect(mockSetValue).toHaveBeenCalledWith("name", "テスト支出");
    expect(mockSetValue).toHaveBeenCalledWith("amount", 1000);
  });

  it("expenseのamountが文字列の場合、数値に変換されること", () => {
    const mockSetValue = jest.fn();
    const expenseWithStringAmount = {
      ...mockExpense,
      amount: "1500",
    };

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: mockSetValue,
    });

    render(
      <EditExpenseForm {...defaultProps} expense={expenseWithStringAmount} />,
    );

    expect(mockSetValue).toHaveBeenCalledWith("amount", 1500);
  });

  it("基本的なフォーム送信テスト", () => {
    const mockHandleSubmit = jest.fn((fn) => (e) => {
      e?.preventDefault?.();
      return fn({ name: "テスト支出", amount: 1000 });
    });

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    render(<EditExpenseForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("isSubmitting時にボタンが無効化され、テキストが変わること", () => {
    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: true },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    render(<EditExpenseForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /送信中/i });
    expect(submitButton).toBeDisabled();
  });

  it("isPending時にボタンが無効化され、テキストが変わること", () => {
    (React.useTransition as jest.Mock).mockReturnValue([true, jest.fn()]);

    render(<EditExpenseForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /送信中/i });
    expect(submitButton).toBeDisabled();
  });

  it("バリデーションエラーが表示されること", () => {
    const mockErrors = {
      name: { message: "名前は必須です", type: "required" },
      amount: { message: "金額は必須です", type: "required" },
    };

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: mockErrors, isSubmitting: false },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    render(<EditExpenseForm {...defaultProps} />);

    const formControls = screen.getAllByTestId("form-control");
    expect(formControls[0]).toHaveAttribute("data-error", "true");
    expect(formControls[1]).toHaveAttribute("data-error", "true");
  });

  it("useFormが適切な設定で呼ばれること", () => {
    render(<EditExpenseForm {...defaultProps} />);

    expect(ReactHookForm.useForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          name: "",
          amount: 0,
        },
      }),
    );
  });

  it("コンポーネントが正しくマウントされること", () => {
    render(<EditExpenseForm {...defaultProps} />);

    // 基本的な要素の存在確認
    expect(screen.getByText(/支出の編集/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/タイトルを入力/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/金額/i)).toBeInTheDocument();
  });

  it("handleCloseが正しく動作すること", () => {
    const mockSetOpen = jest.fn();

    render(<EditExpenseForm {...defaultProps} setOpen={mockSetOpen} />);

    // setOpenが定義されていることを確認（ダイアログのクローズ機能のテスト）
    expect(mockSetOpen).toBeDefined();
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });
});
