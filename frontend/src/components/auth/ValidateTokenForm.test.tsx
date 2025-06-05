import { render, screen } from "@testing-library/react";
import ValidateTokenForm from "./ValidateTokenForm";

// モック
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

jest.mock("../../../actions/validate-token-action", () => ({
  validate_token: jest.fn(),
}));

// React自体をモック
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // useActionStateフックをモック
    useActionState: jest
      .fn()
      .mockReturnValue([{ errors: [], success: "" }, jest.fn()]),
  };
});

describe("ValidateTokenFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("パスワードリセット用の認証コード入力フォームが正しくレンダリングされるかのテストケース", () => {
    // コンポーネントが必要とするpropsをセット
    const setToken = jest.fn();
    const setIsValid = jest.fn();

    render(
      <ValidateTokenForm
        token=""
        setToken={setToken}
        setIsValid={setIsValid}
      />,
    );

    // テキストが表示されていることを確認
    expect(
      screen.getByText("認証コードを入力してください"),
    ).toBeInTheDocument();

    // 6つの入力フィールドが存在することを確認
    const inputFields = screen.getAllByRole("textbox");
    expect(inputFields).toHaveLength(6);
  });
});
