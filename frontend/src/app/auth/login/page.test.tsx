import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

// LoginFormのモック
jest.mock("@/components/auth/LoginForm", () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">ログインフォーム</div>;
  };
});

// LinkButtonのモック
jest.mock("@/components/ui/LinkButton/LinkButton", () => {
  return function MockLinkButton({ children, href }) {
    return (
      <a href={href} data-testid="link-button">
        {children}
      </a>
    );
  };
});

// Next.js用のメタデータ関数のモック（必要に応じて）
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname() {
    return "/auth/login";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

describe("LoginPage", () => {
  it("ログインページが正しくレンダリングされるか", () => {
    render(<LoginPage />);

    // タイトルが表示されていることを確認
    expect(screen.getByText("ログイン")).toBeInTheDocument();

    // ログインフォームが表示されていることを確認
    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    // 登録ページへのリンクが存在することを確認
    const link = screen.getByTestId("link-button");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/register");
    expect(link).toHaveTextContent("アカウントをお持ちでない方はこちら");
  });
});
