import { fireEvent, render, screen } from "@testing-library/react";
import CreateExpenseForm from "./CreateExpenseForm";

const mockPush = jest.fn();
const mockShowMessage = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ id: "test-id" }),
}));

jest.mock("../../../context/MessageContext", () => ({
  useMessage: () => ({
    showMessage: mockShowMessage,
  }),
}));

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
    <input id={id} placeholder={placeholder} {...props} />
  ),
  Slide: ({ children }) => children,
  useMediaQuery: () => false,
  useTheme: () => ({ breakpoints: { down: () => false } }),
}));

jest.mock("@mui/material/transitions", () => ({
  TransitionProps: {},
}));

const mockHandleSubmit = jest.fn((cb) => (e) => {
  e?.preventDefault?.();
  cb({ name: "Test Expense", amount: 10000 });
  return true;
});

jest.mock("react-hook-form", () => {
  return {
    useForm: () => ({
      register: jest.fn((name) => ({ name })),
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: false,
      },
      reset: jest.fn(),
      setValue: jest.fn(),
    }),
  };
});

jest.mock("../../../actions/create-expense-action", () => ({
  createExpense: jest.fn(() =>
    Promise.resolve({ errors: [], success: "支出が正しく作成されました" }),
  ),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
    useState: jest.fn(() => [true, jest.fn()]),
    useEffect: jest.fn(),
    useRef: jest.fn(() => ({ current: null })),
    forwardRef: (fn) => fn,
  };
});

jest.mock("../ui/Button/Button", () => {
  return jest.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ));
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

describe("CreateExpenseFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBudgetId = "123456";

  it("新規支出作成ボタンが表示されること", () => {
    render(<CreateExpenseForm budgetId={mockBudgetId} />);

    expect(
      screen.getByRole("button", { name: /新規支出作成/i }),
    ).toBeInTheDocument();
  });

  it("ダイアログが開いた状態でフォーム要素が表示されること", () => {
    render(<CreateExpenseForm budgetId={mockBudgetId} />);

    expect(screen.getByText("支出の追加")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/タイトルを入力/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/金額/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /追加/i })).toBeInTheDocument();
  });

  it("フォーム送信時にhandleSubmitが呼ばれること", () => {
    render(<CreateExpenseForm budgetId={mockBudgetId} />);

    const submitButton = screen.getByRole("button", { name: /追加/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("バリデーションエラーが正しく表示されること", () => {
    jest
      .spyOn(require("react-hook-form"), "useForm")
      .mockImplementationOnce(() => ({
        register: jest.fn(),
        handleSubmit: jest.fn(),
        formState: {
          errors: {
            name: { message: "支出タイトルは必須です" },
            amount: { message: "金額は必須です" },
          },
          isSubmitting: false,
        },
        reset: jest.fn(),
        setValue: jest.fn(),
      }));
    render(<CreateExpenseForm budgetId={mockBudgetId} />);

    expect(screen.getByText(/支出タイトルは必須です/i)).toBeInTheDocument();
    expect(screen.getByText(/金額は必須です/i)).toBeInTheDocument();
  });
});
