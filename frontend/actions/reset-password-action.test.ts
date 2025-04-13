import { ErrorResponseSchema, ResetPasswordSchema } from "../libs/schemas/auth";
import { reset_password } from "./reset-password-action";

// モックの設定
jest.mock("../libs/schemas/auth");

// 環境変数のモック
const originalEnv = process.env;

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

describe("reset password サーバーアクション", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // グローバルのfetchをモック化
    global.fetch = jest.fn();
    process.env = {
      ...originalEnv,
      API_URL: "http://test-api.com",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("トークンが欠けている場合、エラーメッセージを返すこと", async () => {
    const formData = new MockFormData({
      password: "Password123",
      password_confirmation: "Password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: ["トークンが見つかりません"],
      success: "",
    });

    // fetchが呼ばれていないことを確認
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("パスワードバリデーションに失敗した場合、エラーメッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: "パスワードは8文字以上必要です" },
          { message: "パスワードと確認用パスワードが一致しません" },
        ],
      },
    });

    const formData = new MockFormData({
      token: "reset-token-123",
      password: "pass",
      password_confirmation: "different",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: [
        "パスワードは8文字以上必要です",
        "パスワードと確認用パスワードが一致しません",
      ],
      success: "",
    });

    expect(ResetPasswordSchema.safeParse).toHaveBeenCalledWith({
      password: "pass",
      password_confirmation: "different",
    });

    // fetchが呼ばれていないことを確認
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーレスポンスを返した場合、エラーメッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // ErrorResponseSchemaのモック
    (ErrorResponseSchema.parse as jest.Mock).mockReturnValue({
      error: "無効なリセットトークンです",
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        error: "無効なリセットトークンです",
      }),
    } as any);

    const formData = new MockFormData({
      token: "invalid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: ["無効なリセットトークンです"],
      success: "",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api.com/auth/reset-password/invalid-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "NewPassword123",
          password_confirmation: "NewPassword123",
        }),
      },
    );
  });

  it("APIエラーパース失敗時に適切なエラーメッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // ErrorResponseSchemaのモック - パースエラーをシミュレート
    (ErrorResponseSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error("Parse error");
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue("サーバーエラーが発生しました"),
    } as any);

    const formData = new MockFormData({
      token: "valid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: ["サーバーエラーが発生しました"],
      success: "",
    });
  });

  it("APIが成功レスポンス(オブジェクト)を返した場合、成功メッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        success: "パスワードが正常に変更されました",
      }),
    } as any);

    const formData = new MockFormData({
      token: "valid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードが正常に変更されました",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api.com/auth/reset-password/valid-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "NewPassword123",
          password_confirmation: "NewPassword123",
        }),
      },
    );
  });

  it("APIが成功レスポンス(文字列)を返した場合、成功メッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue("パスワードリセット完了"),
    } as any);

    const formData = new MockFormData({
      token: "valid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードリセット完了",
    });
  });

  it("APIが成功レスポンス(messageフィールド)を返した場合、成功メッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        message: "パスワードリセットに成功しました",
      }),
    } as any);

    const formData = new MockFormData({
      token: "valid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードリセットに成功しました",
    });
  });

  it("成功レスポンスパース失敗時にデフォルトの成功メッセージを返すこと", async () => {
    // ResetPasswordSchemaのモック
    (ResetPasswordSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        password: "NewPassword123",
        password_confirmation: "NewPassword123",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({}), // 空のレスポンス
    } as any);

    const formData = new MockFormData({
      token: "valid-token",
      password: "NewPassword123",
      password_confirmation: "NewPassword123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await reset_password(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードが正常にリセットされました",
    });
  });
});
