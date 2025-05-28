import { fireEvent, render, screen } from "@testing-library/react";
import * as ReactHookForm from "react-hook-form";
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
    <input id={id} placeholder={placeholder} data-error={!!error} {...props} />
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
  const MockButton = ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = "MockButton";
  return MockButton;
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
    const mockErrors = {
      name: { message: "支出タイトルは必須です", type: "required" },
      amount: { message: "金額は必須です", type: "required" },
    };

    jest.spyOn(ReactHookForm, "useForm").mockImplementationOnce(() => ({
      register: jest.fn((name) => ({ name })),
      handleSubmit: jest.fn(),
      formState: {
        errors: mockErrors,
        isSubmitting: false,
      },
      reset: jest.fn(),
      setValue: jest.fn(),
    }));

    render(<CreateExpenseForm budgetId={mockBudgetId} />);

    console.log("Mock errors:", mockErrors);
    console.log("!!mockErrors.name:", !!mockErrors.name);
    console.log("!!mockErrors.amount:", !!mockErrors.amount);

    const formControls = screen.getAllByTestId("form-control");
    expect(formControls).toHaveLength(2);

    const nameInput = screen.getByPlaceholderText(/タイトルを入力/i);
    const amountInput = screen.getByPlaceholderText(/金額/i);

    expect(nameInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();

    console.log("Name input data-error:", nameInput.getAttribute("data-error"));
    console.log(
      "Amount input data-error:",
      amountInput.getAttribute("data-error"),
    );
    console.log(
      "Form control 0 data-error:",
      formControls[0].getAttribute("data-error"),
    );
    console.log(
      "Form control 1 data-error:",
      formControls[1].getAttribute("data-error"),
    );

    expect(formControls[0]).toBeInTheDocument();
    expect(formControls[1]).toBeInTheDocument();
  });
});
