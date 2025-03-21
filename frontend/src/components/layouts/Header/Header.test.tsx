// Header.test.tsx
import { ThemeProvider, createTheme } from "@mui/material";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header";

// Next.js のフックやコンポーネントをモック
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return ({ src, alt, width, height, ...props }: any) => {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
});

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe("Header コンポーネント", () => {
  test("ロゴが正しくレンダリングされる", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const logo = screen.getByAltText("ロゴ");
    expect(logo).toBeVisible();
    expect(logo).toHaveAttribute("src", "/icon.png");
  });

  test("ナビゲーションタブが正しくレンダリングされる", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const homeTab = screen.getByRole("tab", { name: /home/i });
    const budgetTab = screen.getByRole("tab", { name: /予算管理/i });
    const expenseTab = screen.getByRole("tab", { name: /支出監理/i });

    expect(homeTab).toBeVisible();
    expect(budgetTab).toBeVisible();
    expect(expenseTab).toBeVisible();
  });

  test("タブがクリックされたとき、選択状態が変わる", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const homeTab = screen.getByRole("tab", { name: /home/i });
    const budgetTab = screen.getByRole("tab", { name: /予算管理/i });

    // 最初は Home タブが選択されている状態（value=0）
    expect(homeTab).toHaveAttribute("aria-selected", "true");
    expect(budgetTab).toHaveAttribute("aria-selected", "false");

    // 予算管理タブをクリック
    fireEvent.click(budgetTab);

    // クリック後は予算管理タブが選択状態になる
    expect(homeTab).toHaveAttribute("aria-selected", "false");
    expect(budgetTab).toHaveAttribute("aria-selected", "true");
  });

  test("初期状態では「ログイン」ボタンが表示される", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const loginButton = screen.getByRole("button", { name: /ログイン/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("ログインボタンをクリックすると、ログアウトボタンに切り替わる", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const loginButton = screen.getByRole("button", { name: /ログイン/i });

    // ログインボタンをクリック
    fireEvent.click(loginButton);

    // ログアウトボタンが表示される
    const logoutButton = screen.getByRole("button", { name: /ログアウト/i });
    expect(logoutButton).toBeInTheDocument();

    // ログインボタンは表示されていない
    expect(
      screen.queryByRole("button", { name: /ログイン/i }),
    ).not.toBeInTheDocument();
  });

  test("各タブが正しいhref属性を持っている", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const homeTab = screen.getByRole("tab", { name: /home/i });
    const budgetTab = screen.getByRole("tab", { name: /予算管理/i });
    const expenseTab = screen.getByRole("tab", { name: /支出監理/i });

    expect(homeTab.closest("a")).toHaveAttribute("href", "/");
    expect(budgetTab.closest("a")).toHaveAttribute("href", "/budgets");
    expect(expenseTab.closest("a")).toHaveAttribute("href", "/expenses");
  });
});
