import { ClientThemeProvider } from "@/components/layouts/ClientThemeProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import Button from "./Button";

interface MockButtonProps {
  children: ReactNode;
  href: string;
  passHref?: boolean;
}

jest.mock("next/link", () => {
  const MockLink = ({ children, href, passHref }: MockButtonProps) => {
    return (
      <a
        href={href}
        data-testid="next-link"
        data-passhref={passHref?.toString()}
      >
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("ボタンコンポーネントのテストケース", () => {
  it("Linkコンポーネントのhrefで正しい遷移先が設定されているか", () => {
    render(
      <ClientThemeProvider>
        <Button href="/test-url">Click me</Button>
      </ClientThemeProvider>,
    );

    const linkElement = screen.getByTestId("next-link");
    expect(linkElement).toHaveAttribute("href", "/test-url");
  });

  it("子要素を正しく取得できるかのテストケース", () => {
    render(
      <ClientThemeProvider>
        <Button data-testid="typography-test-id">Click me</Button>
      </ClientThemeProvider>,
    );
    const typography = screen.getByTestId("typography-test-id");
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveTextContent("Click me");
  });

  it("クリックイベントが正しく動作するかのテストケース", async () => {
    const handleClick = jest.fn();
    render(
      <ClientThemeProvider>
        <Button onClick={handleClick}>Click me</Button>
      </ClientThemeProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("正しいvariantを適用する", () => {
    render(
      <ClientThemeProvider>
        <Button variant="primary">Primary Button</Button>
      </ClientThemeProvider>,
    );
    const button = screen.getByRole("button", { name: /primary button/i });
    expect(button).toHaveClass("MuiButton-containedPrimary");
  });
});
