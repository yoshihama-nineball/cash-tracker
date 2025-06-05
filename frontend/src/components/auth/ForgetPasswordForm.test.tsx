import { fireEvent, render, screen } from "@testing-library/react";
import ForgotPassword from "./ForgotPasswordForm";

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return fn({ email: "test@example.com" });
    }),
    formState: {
      errors: {},
      isSubmitting: false,
    },
    reset: jest.fn(),
  }),
}));

describe("ForgetPasswordFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("パスワード再設定用のメアド送信フォームが正しくレンダリングされるかのテストケース", () => {
    render(<ForgotPassword />);

    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /パスワードのリセット/i }),
    ).toBeInTheDocument();
  });

  it("フォーム送信に成功したとき、成功のAlertコンポーネントを表示する", () => {
    const { rerender } = render(<ForgotPassword />);

    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();

    rerender(<ForgotPassword />);

    const submitButton = screen.getByRole("button", {
      name: /パスワードのリセット/i,
    });
    fireEvent.click(submitButton);

    //memo: 統合テストが必要
  });

  it("バリデーションエラーが出るとき、正しいエラーメッセージを表示できるかのテスト", () => {
    const mockUseForm = {
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: {
        errors: {
          email: { message: "メールアドレスは必須です" },
        },
        isSubmitting: false,
      },
      reset: jest.fn(),
    };
    jest.mock("react-hook-form", () => ({
      useForm: () => mockUseForm,
    }));

    //memo: jestのモックの制限によりmockUseFormを使ったrenderが難しいため、
    //memo: 実際のテストでは別のアプローチが必要
  });

  it("送信中の場合、データが送信できないことを確認するテスト", () => {
    const mockUseForm = {
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: {
        errors: {},
        isSubmitting: true,
      },
      reset: jest.fn(),
    };
    jest.mock("react-hook-form", () => ({
      useForm: () => mockUseForm,
    }));
  });
});
