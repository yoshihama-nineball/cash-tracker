import { register } from "../actions/create-account-action";
import { ErrorResponseSchema, RegisterSchema } from "../libs/schemas/auth";

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

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: [
        "メールアドレスは必須です",
        "パスワードは8文字以上で入力してください",
      ],
      success: "",
    });

    expect(RegisterSchema.safeParse).toHaveBeenCalledWith({
      email: "",
      name: "テストユーザー",
      password: "123",
      password_confirmation: "123",
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーステータス409を返した場合、エラーメッセージを返すこと", async () => {
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    (ErrorResponseSchema.parse as jest.Mock).mockReturnValue({
      error: "そのメールアドレスは既に登録されています。",
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 409,
      json: async () => ({
        error: "そのメールアドレスは既に登録されています。",
      }),
    });

    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: ["そのメールアドレスは既に登録されています。"],
      success: "",
    });

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/create-account`,
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
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => "アカウントが正常に作成されました",
    });

    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIが成功オブジェクトを返した場合、成功メッセージを返すこと", async () => {
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ success: "アカウントが正常に作成されました" }),
    });

    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIがmessageオブジェクトを返した場合、成功メッセージを返すこと", async () => {
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ message: "アカウントが正常に作成されました" }),
    });

    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "アカウントが正常に作成されました",
    });
  });

  it("APIが予期しない応答形式を返した場合、エラーメッセージを返すこと", async () => {
    (RegisterSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        email: "test@example.com",
        name: "テストユーザー",
        password: "password123",
      },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ unexpected_field: "予期しないレスポンス" }),
    });

    const formData = new MockFormData({
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await register(prevState, formData);

    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });
});
