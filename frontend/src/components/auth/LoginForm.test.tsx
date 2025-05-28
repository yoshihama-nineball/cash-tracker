import { fireEvent, render, screen } from "@testing-library/react";
import * as ReactHookForm from "react-hook-form";
import LoginForm from "./LoginForm";

// モジュールのモック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

jest.mock("../../../actions/authenticate-user-action", () => ({
  loginAction: jest.fn(),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
  };
});

jest.mock("react-hook-form", () => {
  const originalModule = jest.requireActual("react-hook-form");
  return {
    ...originalModule,
    useForm: () => ({
      register: jest.fn((name) => ({ name })),
      handleSubmit: jest.fn(() => jest.fn()),
      formState: {
        errors: {},
        isSubmitting: false,
      },
      reset: jest.fn(),
    }),
  };
});

describe("LoginFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログインフォームが正しくレンダリングされるかのテストケース", () => {
    render(<LoginForm />);

    // フォーム要素の存在確認
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ログイン/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワードの表示切替/i)).toBeInTheDocument();
  });

  it("送信中の場合、ボタンが無効化されることを確認", () => {
    // isSubmittingをtrueにするためのモックを上書き
    jest.spyOn(ReactHookForm, "useForm").mockImplementation(() => ({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: {
        errors: {},
        isSubmitting: true,
      },
      reset: jest.fn(),
    }));

    render(<LoginForm />);

    const loginButton = screen.getByRole("button", { name: /送信中/i });
    expect(loginButton).toBeDisabled();
  });

  it("パスワード表示切り替えボタンが機能することを確認", () => {
    render(<LoginForm />);

    // パスワードフィールドが最初は 'password' タイプであることを確認
    const passwordField = screen.getByLabelText(
      /パスワード/i,
    ) as HTMLInputElement;
    expect(passwordField.type).toBe("password");

    // パスワード表示切り替えボタンを取得
    const passwordToggleButton = screen.getByLabelText(/パスワードの表示切替/i);

    // ボタンが存在することを確認
    expect(passwordToggleButton).toBeTruthy();

    // クリックイベントをシミュレート
    fireEvent.click(passwordToggleButton);

    // パスワードフィールドのタイプが 'text' に変更されたことを確認
    expect(passwordField.type).toBe("text");

    // もう一度クリックして元に戻るか確認
    fireEvent.click(passwordToggleButton);
    expect(passwordField.type).toBe("password");
  });
});
