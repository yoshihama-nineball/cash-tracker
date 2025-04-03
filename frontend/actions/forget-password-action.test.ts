import {
  ErrorResponseSchema,
  ForgotPasswordSchema,
} from "../libs/schemas/auth";
import { forget_password } from "./forget-password-action";

global.fetch = jest.fn();

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

jest.mock("../libs/schemas/auth", () => {
  return {
    ForgotPasswordSchema: {
      safeParse: jest.fn(),
    },
    ErrorResponseSchema: {
      parse: jest.fn(),
    },
  };
});

describe("forgot-password サーバアクション", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("バリデーションに失敗した場合、エラーメッセージを返すこと", async () => {
    ForgotPasswordSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        errors: [{ message: "メールアドレスは必須です" }],
      },
    });

    const formData = new MockFormData({
      email: "",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await forget_password(prevState, formData);

    expect(result).toEqual({
      errors: ["メールアドレスは必須です"],
      success: "",
    });

    expect(ForgotPasswordSchema.safeParse).toHaveBeenCalledWith({
      email: "",
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーステータス409を返した場合、エラーメッセージを返すこと", async () => {
    ForgotPasswordSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        email: "not-found-user@example.com", // ここを変更！
      },
    });

    ErrorResponseSchema.parse.mockReturnValue({
      error: "ユーザが見つかりません",
    });

    global.fetch.mockResolvedValue({
      status: 409,
      json: async () => ({
        error: "ユーザが見つかりません",
      }),
    });

    const formData = new MockFormData({
      email: "not-found-user@example.com",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await forget_password(prevState, formData);

    expect(result).toEqual({
      errors: ["ユーザが見つかりません"],
      success: "",
    });

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/forgot-password`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "not-found-user@example.com",
        }),
      }),
    );
  });

  it("APIが文字列として成功メッセージを返した場合、成功メッセージを返すこと", async () => {
    ForgotPasswordSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
      },
    });

    global.fetch.mockResolvedValue({
      status: 201,
      json: async () =>
        "パスワードをリセットしました。メールを確認してください",
    });

    const formData = new MockFormData({
      email: "test@example.com",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await forget_password(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードをリセットしました。メールを確認してください",
    });
  });

  it("APIが予期しない応答形式をした場合、エラーメッセージを返すこと", async () => {
    ForgotPasswordSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
      },
    });

    global.fetch.mockResolvedValue({
      status: 200,
      json: async () => ({ unexpected_field: "予期しないレスポンス" }),
    });

    const formData = new MockFormData({
      email: "test@example.com",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await forget_password(prevState, formData);

    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });
});
