import { fireEvent, render, screen } from "@testing-library/react";
import CreateBudgetForm from "./CreateBudgetForm";

// App Router環境をモック
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

// mock handleSubmit
const mockHandleSubmit = jest.fn((cb) => (e) => {
  e?.preventDefault?.();
  cb({ name: "Test Budget", amount: 10000 });
  return true;
});

// react-hook-formをモック
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

// Server Actionをモック
jest.mock("../../../actions/create-budget-action", () => ({
  createBudget: jest.fn(() =>
    Promise.resolve({ errors: [], success: "Success" }),
  ),
}));

// useActionStateをモック
jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
  };
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

describe("CreateBudgetForm コンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされること", () => {
    render(<CreateBudgetForm />);

    // フォーム要素の存在確認 - getByText/getByRoleを使用
    expect(screen.getByText(/予算作成/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/タイトルを入力/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/金額/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /追加/i })).toBeInTheDocument();
  });

  it("フォーム送信時にhandleSubmitが呼ばれること", () => {
    render(<CreateBudgetForm />);

    const submitButton = screen.getByRole("button", { name: /追加/i });
    fireEvent.click(submitButton);

    // handleSubmitが呼ばれたことを確認
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("バリデーションエラーが正しく表示されること", () => {
    // エラー状態でuseFormをモック
    jest
      .spyOn(require("react-hook-form"), "useForm")
      .mockImplementationOnce(() => ({
        register: jest.fn(),
        handleSubmit: jest.fn(),
        formState: {
          errors: {
            name: { message: "予算タイトルは必須です" },
            amount: { message: "金額は必須です" },
          },
          isSubmitting: false,
        },
        reset: jest.fn(),
        setValue: jest.fn(),
      }));

    render(<CreateBudgetForm />);

    // エラーメッセージの存在確認
    expect(screen.getByText(/予算タイトルは必須です/i)).toBeInTheDocument();
    expect(screen.getByText(/金額は必須です/i)).toBeInTheDocument();
  });
});
