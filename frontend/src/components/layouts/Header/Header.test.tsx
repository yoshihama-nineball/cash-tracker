// Header.test.tsx
import { ThemeProvider, createTheme } from "@mui/material";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import Header from "./Header";

interface MockHeaderProps {
  children: ReactNode;
  href: string;
  passHref?: boolean;
}

// 型定義
interface MockLinkProps {
  children: ReactNode;
  href: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface MockImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  [key: string]: unknown;
}

interface TestWrapperProps {
  children: ReactNode;
}

// Next.js のフックやコンポーネントをモック
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Linkコンポーネントをモック（カスタムコンポーネント）
jest.mock("@/components/ui/Link/Link", () => {
  const MockLink = ({ children, href, style, ...props }: MockLinkProps) => {
    return (
      <a href={href} style={style} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("next/image", () => {
  const MockImage = ({ src, alt, width, height, ...props }: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
  MockImage.displayName = "MockImage";
  return MockImage;
});

// logout action をモック
jest.mock("../../../../actions/logout-user-action", () => ({
  logout: jest.fn(),
}));

// Button コンポーネントをモック
jest.mock("@/components/ui/Button/Button", () => {
  const MockButton = ({ children, href, ...props }: MockHeaderProps) => {
    if (href) {
      return (
        <a href={href} {...props}>
          <button>{children}</button>
        </a>
      );
    }
    return <button {...props}>{children}</button>;
  };
  MockButton.displayName = "MockButton";
  return MockButton;
});

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: TestWrapperProps) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// テスト用のユーザーデータ
const mockUserData = {
  user: {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
  },
  isAuth: true,
};

describe("Header コンポーネント", () => {
  test("ロゴが正しくレンダリングされる", () => {
    render(
      <TestWrapper>
        <Header userData={null} />
      </TestWrapper>,
    );

    const logo = screen.getByAltText("ロゴ");
    expect(logo).toBeVisible();
    expect(logo).toHaveAttribute("src", "/icon.png");
  });

  test("ナビゲーションタブが正しくレンダリングされる", () => {
    render(
      <TestWrapper>
        <Header userData={null} />
      </TestWrapper>,
    );

    // タブとして要素を取得
    const homeTab = screen.getByRole("tab", { name: /home/i });
    const budgetTab = screen.getByRole("tab", { name: /予算管理/i });
    const expenseTab = screen.getByRole("tab", { name: /支出監理/i });

    expect(homeTab).toBeVisible();
    expect(budgetTab).toBeVisible();
    expect(expenseTab).toBeVisible();
  });

  test("タブが正しいhref属性を持っている", () => {
    render(
      <TestWrapper>
        <Header userData={null} />
      </TestWrapper>,
    );

    const homeTab = screen.getByRole("tab", { name: /home/i });
    const budgetTab = screen.getByRole("tab", { name: /予算管理/i });
    const expenseTab = screen.getByRole("tab", { name: /支出監理/i });

    expect(homeTab).toHaveAttribute("href", "/");
    expect(budgetTab).toHaveAttribute("href", "/budgets");
    expect(expenseTab).toHaveAttribute("href", "/expenses");
  });

  test("未認証状態では「ログイン」ボタンが表示される", () => {
    render(
      <TestWrapper>
        <Header userData={null} />
      </TestWrapper>,
    );

    const loginButton = screen.getByRole("button", { name: /ログイン/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("認証済み状態ではアバターが表示される", () => {
    render(
      <TestWrapper>
        <Header userData={mockUserData} />
      </TestWrapper>,
    );

    // アバターが表示されていることを確認
    const avatar = screen.getByText("テ"); // stringAvatar関数により最初の文字が表示される
    expect(avatar).toBeInTheDocument();

    // ログインボタンは表示されていない
    expect(
      screen.queryByRole("button", { name: /ログイン/i }),
    ).not.toBeInTheDocument();
  });

  test("アバターをクリックするとメニューが表示される", () => {
    render(
      <TestWrapper>
        <Header userData={mockUserData} />
      </TestWrapper>,
    );

    const avatar = screen.getByText("テ");
    fireEvent.click(avatar);

    // メニューアイテムが表示される
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /プロフィール/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /予算/i })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /ログアウト/i }),
    ).toBeInTheDocument();
  });

  test("タブリストが正しく表示される", () => {
    render(
      <TestWrapper>
        <Header userData={null} />
      </TestWrapper>,
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute("aria-label", "basic tabs example");
  });
});
