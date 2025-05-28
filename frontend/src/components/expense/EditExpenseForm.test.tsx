import { render, screen } from "@testing-library/react";
import EditExpenseForm from "./EditExpenseForm";

// カスタムButtonコンポーネントをモック
jest.mock("../ui/Button/Button", () => {
  return jest.fn(({ children, onClick, disabled, type, ...props }) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  ));
});

// MUIコンポーネントをモック
jest.mock("@mui/material", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Dialog: ({ open, children }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  FormControl: ({ children }) => <div>{children}</div>,
  FormHelperText: ({ children }) => <span>{children}</span>,
  FormLabel: ({ children }) => <label>{children}</label>,
  TextField: ({ placeholder, id, ...props }) => (
    <input id={id} placeholder={placeholder} aria-label={id} {...props} />
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

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
    useState: jest.fn(() => [false, jest.fn()]),
    useEffect: jest.fn(),
    useRef: jest.fn(() => ({ current: null })),
    forwardRef: (fn) => fn,
  };
});

jest.mock("react-hook-form", () => ({
  useForm: () => ({
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
    setValue: jest.fn(), // setValueが呼ばれることを確認
  }),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
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

  it("初期値が正しく設定されること", () => {
    render(<EditExpenseForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText(
      /タイトルを入力/i,
    ) as HTMLInputElement;
    const amountInput = screen.getByPlaceholderText(
      /金額/i,
    ) as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();

    expect(nameInput.value).toHaveAttribute("id", "name");
    expect(amountInput.value).toHaveAttribute("id", "amount");
  });
});
