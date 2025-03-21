import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './page';

// Mock the ConfirmAccountForm component
jest.mock('@/components/auth/ForgotPasswordForm', () => {
  return function MockForgotPasswordForm() {
    return <div data-testid="forgot-password">パスワードのリセットフォーム</div>;
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
    return "/auth/forgot-password";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// LinkButtonのモック
jest.mock("@/components/ui/LinkButton/LinkButton", () => {
  return function MockLinkButton({ children, href }: any) {
    return (
      <a href={href} data-testid="link-button">
        {children}
      </a>
    );
  };
});


describe('ConfirmAccountPage', () => {
  beforeEach(() => {
    render(<ForgotPasswordPage />);
  });

  test('レンダリングされたページにはタイトルが表示されている', () => {
    const heading = screen.getByRole('heading', { level: 4, name: 'パスワードをお忘れですか？' });
    expect(heading).toBeInTheDocument();
  });

  test('サブタイトルが正しく表示されている', () => {
    const subheading = screen.getByRole('heading', { level: 5 });
    expect(subheading).toHaveTextContent('こちらから 再設定できます');
  });

  test('認証コードの部分が強調表示されている', () => {
    const highlightedText = screen.getByText('再設定');
    expect(highlightedText).toHaveStyle('color: rgb(156, 39, 176)');
  });

  test('ConfirmAccountページがレンダリングされている', () => {
    const formComponent = screen.getByTestId('forgot-password');
    expect(formComponent).toBeInTheDocument();

    const links = screen.getAllByTestId("link-button")
    const loginLink = links.find((link) => link.textContent === "アカウントをお持ちの方はこちら")
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute("href", "/auth/login")

    const registerLink = links.find((link) => link.textContent === "アカウントをお持ちでない方はこちら")
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute("href", "/auth/register")
  });

  test('コンテナが最大幅smでレンダリングされている', () => {
    // Container propsのテスト
    const container = document.querySelector('.MuiContainer-root');
    expect(container).toHaveClass('MuiContainer-maxWidthSm');
  });
});