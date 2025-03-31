import { register } from "../actions/create-account-action";
import { ErrorResponseSchema, RegisterSchema } from "../libs/schemas/auth";

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
    RegisterSchema: {
      safeParse: jest.fn(),
    },
    ErrorResponseSchema: {
      parse: jest.fn(),
    },
  };
});

describe("register サーバーアクション", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("バリデーションに失敗した場合、エラーメッセージを返すこと", async () => {
    // バリデーション失敗のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: "メールアドレスは必須です" },
          { message: "パスワードは8文字以上で入力してください" },
        ],
      },
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "",
      name: "テストユーザー",
      password: "123",
      password_confirmation: "123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [
        "メールアドレスは必須です",
        "パスワードは8文字以上で入力してください",
      ],
      success: "",
    });

    // RegisterSchema.safeParseが正しい引数で呼び出されたことを確認
    expect(RegisterSchema.safeParse).toHaveBeenCalledWith({
      email: "",
      name: "テストユーザー",
      password: "123",
      password_confirmation: "123",
    });

    // fetchが呼び出されていないことを確認
    expect(fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーステータス409を返した場合、エラーメッセージを返すこと", async () => {
    // バリデーション成功のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    // ErrorResponseSchemaのモック
    (ErrorResponseSchema.parse as jest.Mock).mockReturnValue({
      error: "そのメールアドレスは既に登録されています。",
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 409,
      json: async () => ({
        error: "そのメールアドレスは既に登録されています。",
      }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: ["そのメールアドレスは既に登録されています。"],
      success: "",
    });

    // fetchが正しく呼び出されたことを確認
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/create-account`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "テストユーザー",
          password: "password123",
          email: "test@example.com",
        }),
      }),
    );
  });

  it("APIが文字列として成功メッセージを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => "アカウントが正常に作成されました",
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIが成功オブジェクトを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ success: "アカウントが正常に作成されました" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIがmessageオブジェクトを返した場合、成功メッセージを返すこと", async () => {
    // バリデーション成功のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ message: "アカウントが正常に作成されました" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIが予期しない応答形式を返した場合、エラーメッセージを返すこと", async () => {
    // バリデーション成功のモック
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    // fetch APIの応答をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ unexpected_field: "予期しないレスポンス" }),
    });

    // FormDataの作成
    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    // 初期状態
    const prevState = { errors: [], success: "" };

    // アクションの実行
    const result = await register(prevState, formData);

    // 期待する結果を検証
    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });
});
