import { ErrorResponseSchema, LoginSchema } from "../libs/schemas/auth";
import { authenticate } from "./authenticate-user-action";

// process.env.API_URLを設定
process.env.API_URL = "http://localhost:4000/api";

// next/headersのモック
jest.mock("next/headers", () => {
  const mockCookieStore = {
    set: jest.fn(),
  };
  return {
    cookies: jest.fn(() => mockCookieStore),
  };
});

// next/navigationのモック
jest.mock("next/navigation", () => {
  return {
    redirect: jest.fn(),
  };
});

// LoginSchemaとErrorResponseSchemaのモック
jest.mock("../libs/schemas/auth", () => {
  return {
    LoginSchema: {
      safeParse: jest.fn(),
    },
    ErrorResponseSchema: {
      parse: jest.fn(),
    },
  };
});

// グローバルなfetchをモック
global.fetch = jest.fn();

// console.errorをモック
console.error = jest.fn();

describe("authenticate関数", () => {
  const prevState = { errors: [] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("バリデーションエラーの場合、エラーメッセージを返す", async () => {
    // バリデーション失敗のモック
    LoginSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: "メールアドレスの形式が正しくありません" },
          { message: "パスワードは8文字以上で入力してください" },
        ],
      },
    });

    // FormDataを作成
    const formData = new FormData();
    formData.append("email", "invalid-email");
    formData.append("password", "123");

    const result = await authenticate(prevState, formData);

    // fetchは呼ばれない
    expect(fetch).not.toHaveBeenCalled();

    // エラーメッセージが含まれている
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain("メールアドレスの形式が正しくありません");
    expect(result.errors).toContain("パスワードは8文字以上で入力してください");
  });

  it("認証に成功した場合、cookieを設定し、リダイレクトする", async () => {
    // バリデーション成功のモック
    LoginSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        email: "user@example.com",
        password: "password123",
      },
    });

    // fetchのレスポンスをモック
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue("mock-token"),
    };
    fetch.mockResolvedValue(mockResponse);

    // FormDataを作成
    const formData = new FormData();
    formData.append("email", "user@example.com");
    formData.append("password", "password123");

    await authenticate(prevState, formData);

    // APIが正しいパラメータで呼ばれる
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/login`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    // bodyの内容を個別に検証（順序に依存しないため）
    const callArgs = fetch.mock.calls[0][1];
    const bodyContent = JSON.parse(callArgs.body);
    expect(bodyContent).toEqual({
      email: "user@example.com",
      password: "password123",
    });

    // cookieが設定される
    const cookieStore = require("next/headers").cookies();
    expect(cookieStore.set).toHaveBeenCalledWith({
      name: "CASHTRACKR_TOKEN",
      value: "mock-token",
      httpOnly: true,
      path: "/",
    });

    // リダイレクトが呼ばれる
    const { redirect } = require("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/admin");
  });

  it("APIがエラーを返した場合、エラーメッセージを返す", async () => {
    // バリデーション成功のモック
    LoginSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        email: "user@example.com",
        password: "password123",
      },
    });

    // FormDataを作成
    const formData = new FormData();
    formData.append("email", "user@example.com");
    formData.append("password", "password123");

    // 認証失敗のモック
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: "Authentication failed" }),
    };
    fetch.mockResolvedValue(mockResponse);

    // ErrorResponseSchemaのモック
    ErrorResponseSchema.parse.mockReturnValue({ error: "Authentication failed" });

    const result = await authenticate(prevState, formData);

    // APIが呼ばれる
    expect(fetch).toHaveBeenCalled();

    // エラーメッセージ
    expect(result).toEqual({
      errors: ["Authentication failed"],
    });

    // cookieは設定されない
    const cookieStore = require("next/headers").cookies();
    expect(cookieStore.set).not.toHaveBeenCalled();

    // リダイレクトは呼ばれない
    const { redirect } = require("next/navigation");
    expect(redirect).not.toHaveBeenCalled();
  });

  // TODO: 現在の実装では例外処理が明示的に行われていないため、
  // テストを更新するか、実装に例外処理を追加する必要がある
})