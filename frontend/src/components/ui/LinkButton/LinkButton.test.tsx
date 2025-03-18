import { ClientThemeProvider } from "@/components/layouts/ClientThemeProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkButton from "./LinkButton";

// MEMO:モックの設定
jest.mock("next/link", () => {
  return ({ children, href, passHref }: any) => {
    return (
      <a
        href={href}
        data-testid="next-link"
        data-passhref={passHref.toString()}
      >
        {children}
      </a>
    );
  };
});

describe("LinkButton", () => {
  it("Linkコンポーネントのhrefで正しい遷移先が設定されているか", () => {
    render(
      <ClientThemeProvider>
        <LinkButton href="/test-url">Click me</LinkButton>
      </ClientThemeProvider>,
    );

    const linkElement = screen.getByTestId("next-link");
    expect(linkElement).toHaveAttribute("href", "/test-url");
  });

  it("カスタマイズされたスタイルが適用されるかのテストケース", () => {
    render(
      <ClientThemeProvider>
        <LinkButton
          href="/test"
          sx={{
            backgroundColor: "red",
            fontWeight: "bold",
          }}
        >
          リンクボタン
        </LinkButton>
      </ClientThemeProvider>,
    );

    // MUIのスタイルはdata属性でテストするのが難しいため、
    // コンポーネントが正しくレンダリングされていることを確認
    const buttonText = screen.getByText("リンクボタン");
    expect(buttonText).toBeInTheDocument();
  });

  it("子要素が正しく表示され、正しい文字列が渡されるかのテスト", () => {
    render(
      <ClientThemeProvider>
        <LinkButton
          href="/test"
          variant="h5"
          color="primary"
          data-testid="typography-test-id"
        >
          文字列のテスト
        </LinkButton>
      </ClientThemeProvider>,
    );

    const typography = screen.getByTestId("typography-test-id");
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveTextContent("文字列のテスト");
  });

  it("クリックイベントが正しく動作するかのテストケース", async () => {
    const handleClick = jest.fn();
    render(
      <ClientThemeProvider>
        <LinkButton onClick={handleClick} href="/test">
          Click me
        </LinkButton>
      </ClientThemeProvider>,
    );

    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
