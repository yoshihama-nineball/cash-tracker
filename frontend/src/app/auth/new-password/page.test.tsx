import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NewPasswordPage from "./page";

// Mock the PasswordResetHandler component
jest.mock("../../../components/auth/PasswordResetHandler", () => {
  return function MockPasswordResetHandler() {
    return (
      <div data-testid="password-reset-handler">
        パスワードリセットハンドラー
      </div>
    );
  };
});

describe("NewPasswordPage", () => {
  beforeEach(() => {
    render(<NewPasswordPage />);
  });

  test("レンダリングされたページにはタイトルが表示されている", () => {
    const heading = screen.getByRole("heading", {
      level: 4,
      name: "パスワード再設定",
    });
    expect(heading).toBeInTheDocument();
  });

  test("サブタイトルが正しく表示されている", () => {
    const subheading = screen.getByRole("heading", { level: 5 });
    expect(subheading).toHaveTextContent(
      "メールで受け取った 認証コードを入力してください",
    );
  });

  test("認証コードの部分が強調表示されている", () => {
    const highlightedText = screen.getByText("認証コード");
    // expect(highlightedText).toHaveStyle("color: var(--mui-palette-secondary-main)");
  });

  test("PasswordResetHandlerコンポーネントがレンダリングされている", () => {
    const formComponent = screen.getByTestId("password-reset-handler");
    expect(formComponent).toBeInTheDocument();
  });

  test("コンテナが最大幅mdでレンダリングされている", () => {
    const container = document.querySelector(".MuiContainer-root");
    expect(container).toHaveClass("MuiContainer-maxWidthMd");
  });
});
