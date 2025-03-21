import { render, screen } from "@testing-library/react";
import RegisterPage from "./page";

// LoginFormのモック
jest.mock("@/components/auth/RegisterForm", () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">アカウント作成フォーム</div>;
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
    return "/auth/register";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

describe("RegisterPage", () => {
  it("ユーザ登録ページが正しくレンダリングされるか", () => {
    render(<RegisterPage />);

    // タイトルが表示されていることを確認
    expect(screen.getByText("アカウント作成")).toBeInTheDocument();

    // ログインフォームが表示されていることを確認
    expect(screen.getByTestId("register-form")).toBeInTheDocument();

    // 登録ページへのリンクが存在することを確認
    const links = screen.getAllByTestId("link-button");
    const loginLink = links.find(
      (link) => link.textContent === "アカウントをお持ちの方はこちら",
    );
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/login");

    const forgotPasswordLink = links.find(
      (link) => link.textContent === "パスワードをお忘れの方はこちら",
    );
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute("href", "/auth/forgot-password");
  });
});
