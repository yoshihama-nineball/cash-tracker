import { ValidateTokenSchema } from "../libs/schemas/auth";
import { validate_token } from "./validate-token-action";

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

describe("validate token サーバーアクション", () => {
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

  it("バリデーションに失敗した場合、エラーメッセージを返すこと", async () => {
    // ValidateTokenSchemaのモック
    (ValidateTokenSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: "認証コードは必須です" },
          { message: "トークンが無効です" },
        ],
      },
    });

    const formData = new MockFormData({
      token: "",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await validate_token(prevState, formData);

    expect(result).toEqual({
      errors: ["認証コードは必須です", "トークンが無効です"],
      success: "",
    });

    expect(ValidateTokenSchema.safeParse).toHaveBeenCalledWith({
      token: "",
    });

    // fetchが呼ばれていないことを確認
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("APIがエラーステータス409を返した場合、エラーメッセージを返すこと", async () => {
    // ValidateTokenSchemaのモック
    (ValidateTokenSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      status: 409,
      json: jest.fn().mockResolvedValue({
        error: "トークンが無効です",
      }),
    } as any);

    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await validate_token(prevState, formData);

    expect(result).toEqual({
      errors: ["トークンが無効です"],
      success: "",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api.com/auth/validate-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "123456",
        }),
      },
    );
  });

  it("APIが成功レスポンスを返した場合、成功メッセージを返すこと", async () => {
    // ValidateTokenSchemaのモック
    (ValidateTokenSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        success: "認証に成功しました",
      }),
    } as any);

    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await validate_token(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "認証に成功しました",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api.com/auth/validate-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "123456",
        }),
      },
    );
  });

  it("文字列として成功メッセージを返すAPIの場合", async () => {
    // ValidateTokenSchemaのモック
    (ValidateTokenSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        token: "123456",
      },
    });

    // fetchのモック
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue("認証に成功しました"),
    } as any);

    const formData = new MockFormData({
      token: "123456",
    }) as unknown as FormData;

    const prevState = { errors: [], success: "" };

    const result = await validate_token(prevState, formData);

    expect(result).toEqual({
      errors: [],
      success: "認証に成功しました",
    });
  });
});
