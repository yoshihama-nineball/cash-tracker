import { render, screen } from "@testing-library/react";
import ResetPasswordForm from "./ResetPasswordForm";

//モックの作成
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return fn({
        password: "password",
        password_confirmation: "password",
      });
    }),
    formState: {
      errors: {},
      isSubmitting: false,
    },
    reset: jest.fn(),
  }),
}));

describe("ResetPasswordFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザ登録フォームが正しくレンダリングされるかのテストケース", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/パスワード(確認)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード.*確認/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /アカウント作成/i }),
    ).toBeInTheDocument();
  });

  // it("パスワードとパスワード確認の表示ボタンが正しく動作するかのテスト", async () => {
  //   render(<RegisterForm />);

  //   // パスワードフィールドとボタンを取得
  //   const passwordField = screen.getByLabelText("パスワード");
  //   const confirmPasswordField = screen.getByLabelText(/パスワード.*確認/i);
  //   const passwordButtons = screen.getAllByRole("button", { name: "" });

  //   // 最初のボタンはパスワード用、2番目はパスワード確認用と想定
  //   const passwordVisibilityButton = passwordButtons[0];
  //   const confirmPasswordVisibilityButton = passwordButtons[1];

  //   // 初期状態の確認
  //   expect(passwordField).toHaveAttribute("type", "password");
  //   expect(confirmPasswordField).toHaveAttribute("type", "password");

  //   // パスワードの表示/非表示テスト
  //   fireEvent.click(passwordVisibilityButton);
  //   expect(passwordField).toHaveAttribute("type", "text");
  //   expect(confirmPasswordField).toHaveAttribute("type", "password"); // 確認用は変わらない

  //   fireEvent.click(passwordVisibilityButton);
  //   expect(passwordField).toHaveAttribute("type", "password");

  //   // パスワード確認の表示/非表示テスト
  //   fireEvent.click(confirmPasswordVisibilityButton);
  //   expect(confirmPasswordField).toHaveAttribute("type", "text");
  //   expect(passwordField).toHaveAttribute("type", "password"); // 通常のパスワードは変わらない

  //   fireEvent.click(confirmPasswordVisibilityButton);
  //   expect(confirmPasswordField).toHaveAttribute("type", "password");
  // });

  // it("フォーム送信に成功したとき、成功のAlertコンポーネントとメッセージを表示する", async () => {
  //   // フォーム送信の成功状態をシミュレート
  //   const { rerender } = render(<RegisterForm />);

  //   // 成功メッセージが初期状態では表示されていない
  //   expect(screen.queryByText(/success/i)).not.toBeInTheDocument();

  //   // コンポーネントの状態を変更して再レンダリング
  //   rerender(<RegisterForm />);

  //   // フォーム送信のシミュレーション
  //   const submitButton = screen.getByRole("button", {
  //     name: /アカウント作成/i,
  //   });
  //   fireEvent.click(submitButton);

  //   // useStateのモックを用いて成功状態をシミュレート
  //   // 注意: これは実際のコンポーネントの状態を変更しないため、
  //   // MEMO:テストでは直接確認できないため、実際のテストでは統合テストが必要
  // });

  // it("バリデーションエラーが出るとき、正しいエラーメッセージを表示できるかのテスト", async () => {
  //   const mockUseForm = {
  //     register: jest.fn(),
  //     handleSubmit: jest.fn(),
  //     formState: {
  //       errors: {
  //         email: { message: "メールアドレスは必須です" },
  //         name: { message: "ユーザー名は必須です" },
  //         password: { message: "パスワードは必須です" },
  //         password_confirmation: { message: "パスワード(確認)は必須です" },
  //       },
  //       isSubmitting: false,
  //     },
  //     reset: jest.fn(),
  //   };

  //   jest.mock("react-hook-form", () => ({
  //     useForm: () => mockUseForm,
  //   }));

  //   // 本当はここでmockUseFormを使ってrenderしたいが、
  //   // jestのモックの制限により簡単にはできないため、
  //   // 実際のテストでは別のアプローチが必要
  // });

  // it("送信中の場合、データが送信できないことを確認するテスト", async () => {
  //   // 送信中状態のフォームレンダリングをシミュレート
  //   const mockUseForm = {
  //     register: jest.fn(),
  //     handleSubmit: jest.fn(),
  //     formState: {
  //       errors: {},
  //       isSubmitting: true,
  //     },
  //     reset: jest.fn(),
  //   };

  //   jest.mock("react-hook-form", () => ({
  //     useForm: () => mockUseForm,
  //   }));

  //   // 同様に、モックの制限により実際のテストには統合テストが必要
  // });
});
