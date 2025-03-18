import { ClientThemeProvider } from "@/components/layouts/ClientThemeProvider";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("アラートコンポーネントのテスト", () => {
  it("子要素を正しく取得できるかのテスト", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="success" data-testid="typo-test-id">
          アラートの文字列
        </Alert>
      </ClientThemeProvider>,
    );
    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();
    expect(screen.getByText("アラートの文字列")).toBeInTheDocument();
  });

  it("正しいseverityを適用する", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="success">
          成功メッセージ
        </Alert>
      </ClientThemeProvider>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-standardSuccess");
  });

  it("error severityで正しいクラスが適用される", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="error">
          エラーメッセージ
        </Alert>
      </ClientThemeProvider>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-standardError");
  });

  it("warning severityで正しいクラスが適用される", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="warning">
          警告メッセージ
        </Alert>
      </ClientThemeProvider>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-standardWarning");
  });

  it("info severityで正しいクラスが適用される", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="info">
          情報メッセージ
        </Alert>
      </ClientThemeProvider>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-standardInfo");
  });

  it("アイコンが正しく表示される", () => {
    render(
      <ClientThemeProvider>
        <Alert severity="success">
          成功メッセージ
        </Alert>
      </ClientThemeProvider>,
    );
    const alert = screen.getByRole("alert");
    const icon = alert.querySelector('svg[data-testid="CheckCircleIcon"]');
    expect(icon).toBeInTheDocument();
  });
});