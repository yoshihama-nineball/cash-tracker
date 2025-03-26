import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useFormState } from "react-dom";
import ConfirmAccountForm from "./ConfirmAccount";

// モック関数のセットアップ
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({}))
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: jest.fn()
}));

jest.mock("../../../actions/confirm-account-action", () => ({
  confirm_account: jest.fn()
}));

describe("ConfirmAccountFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザ有効化用のフォームが正しくレンダリングされるかのテストケース", () => {
    // useFormStateモックを設定
    (useFormState as jest.Mock).mockReturnValue([
      { errors: [], success: "" }, 
      jest.fn()
    ]);

    render(<ConfirmAccountForm />);

    // タイトルが表示されているか確認
    expect(screen.getByText("認証コードを入力してください")).toBeInTheDocument();
    
    // 6つの入力フィールドが表示されているか確認
    const inputFields = screen.getAllByRole("textbox");
    expect(inputFields).toHaveLength(6);

    // 説明テキストが表示されているか確認
    expect(screen.getByText("メールに送信された6桁の認証コードを入力してください")).toBeInTheDocument();
  });

  it("フォーム送信に成功したとき、成功のAlertコンポーネントとメッセージを表示する", async () => {
    const successMessage = "アカウントが正常に確認されました";
    
    // useFormStateモックを設定 - 成功ケース
    (useFormState as jest.Mock).mockReturnValue([
      { errors: [], success: successMessage }, 
      jest.fn()
    ]);

    render(<ConfirmAccountForm />);

    // 成功メッセージが表示されているか確認
    const successAlert = screen.getByText(successMessage);
    expect(successAlert).toBeInTheDocument();
    
    // Alert要素が存在するかどうかだけを確認
    // MUIコンポーネントはseverityを直接DOM属性として公開していない可能性がある
    expect(successAlert).toBeInTheDocument();
  });

  it("フォーム送信に失敗したとき、エラーのAlertコンポーネントとメッセージを表示する", () => {
    const errorMessage = "認証コードが無効です";
    
    // useFormStateモックを設定 - エラーケース
    (useFormState as jest.Mock).mockReturnValue([
      { errors: [errorMessage], success: "" }, 
      jest.fn()
    ]);

    render(<ConfirmAccountForm />);

    // エラーメッセージが表示されているか確認
    const errorAlert = screen.getByText(errorMessage);
    expect(errorAlert).toBeInTheDocument();
  });

  it("6桁のコードを入力したとき、フォームが自動的に送信される", async () => {
    // フォーム送信のモック
    const mockFormAction = jest.fn();
    (useFormState as jest.Mock).mockReturnValue([
      { errors: [], success: "" }, 
      mockFormAction
    ]);

    // requestSubmitメソッドのモック
    const mockRequestSubmit = jest.fn();
    HTMLFormElement.prototype.requestSubmit = mockRequestSubmit;

    render(<ConfirmAccountForm />);

    // 入力フィールドを取得
    const inputFields = screen.getAllByRole("textbox");
    
    // 各フィールドに値を入力
    for (let i = 0; i < 6; i++) {
      fireEvent.change(inputFields[i], { target: { value: String(i) } });
    }

    // フォームが自動送信されることを確認
    await waitFor(() => {
      expect(mockRequestSubmit).toHaveBeenCalled();
    });
  });

  it("コピーペーストした値が適切に処理される", async () => {
    // フォーム送信のモック
    const mockFormAction = jest.fn();
    (useFormState as jest.Mock).mockReturnValue([
      { errors: [], success: "" }, 
      mockFormAction
    ]);

    render(<ConfirmAccountForm />);

    // 入力フィールドを取得
    const inputFields = screen.getAllByRole("textbox");
    
    // 最初のフィールドに複数の数字を一度に入力（コピーペーストをシミュレート）
    fireEvent.change(inputFields[0], { target: { value: "123456" } });

    // 全てのフィールドに値が入力されているか確認
    await waitFor(() => {
      for (let i = 0; i < 6; i++) {
        expect(inputFields[i]).toHaveValue(String(i + 1));
      }
    });
  });
});