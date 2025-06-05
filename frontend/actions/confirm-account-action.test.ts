import {
  ConfirmAccountSchema,
  ErrorResponseSchema,
} from "../libs/schemas/auth";
import { confirm_account } from "./confirm-account-action";

// サーバーアクション用にfetchをモック化
global.fetch = jest.fn();

// FormDataをモック化
class MockFormData {
  private data = new Map();

  constructor(initialData = {}) {
    Object.entries(initialData).forEach(([key, value]) => {
      this.data.set(key, value);
    });
  }

  get(key) {
    return this.data.get(key);
  }

  set(key, value) {
    this.data.set(key, value);
    return this;
  }
}

// モック用のzodモジュール
jest.mock("../libs/schemas/auth", () => {
  return {
    ConfirmAccountSchema: {
      safeParse: jest.fn(),
    },
    ErrorResponseSchema: {
      parse: jest.fn(),
    },
  };
});

describe("confirm_account サーバーアクション", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("バリデーションに失敗した場合、エラーメッセージを返すこと", async () => {
    // バリデーション失敗のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: "認証コードは6桁でなければなりません" },
          { message: "認証コードは数字のみで入力してください" },
        ],
      },
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "abc", // 無効なトークン
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [
        "認証コードは6桁でなければなりません",
        "認証コードは数字のみで入力してください",
      ],
      success: "",
    });

    // ConfirmAccountSchema.safeParseが正しい引数で呼び出されたことを確認
    expect(ConfirmAccountSchema.safeParse).toHaveBeenCalledWith({
      token: "abc",
    });

    // fetchが呼び出されていないことを確認
    expect(fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーステータス409を返した場合、エラーメッセージを返すこと", async () => {
    // バリデーション成功のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // ErrorResponseSchemaのモック
    (ErrorResponseSchema.parse as jest.Mock).mockReturnValue({
      error: "無効な認証コードです",
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 409,
      json: async () => ({ error: "無効な認証コードです" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: ["無効な認証コードです"],
      success: "",
    });

    // fetchが正しく呼び出されたことを確認
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-account`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "123456",
        }),
      }),
    );
  });

  it("APIが文字列として成功メッセージを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => "アカウントが確認されました",
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが確認されました",
    });
  });

  it("APIが成功オブジェクトを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ success: "アカウントが確認されました" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが確認されました",
    });
  });

  it("APIがmessageオブジェクトを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ message: "アカウントが確認されました" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが確認されました",
    });
  });

  it("APIが予期しない応答形式を返した場合、エラーメッセージを返すこと", async () => {
    // バリデーション成功のモック
    (ConfirmAccountSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ unexpected_field: "予期しないレスポンス" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await confirm_account(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });
});
