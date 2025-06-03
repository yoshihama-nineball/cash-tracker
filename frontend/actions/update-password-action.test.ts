import { updatePassword } from "./update-password-action";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("../libs/auth/token", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../libs/schemas/auth", () => ({
  UpdatePasswordSchema: {
    safeParse: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("updatePassword", () => {
  let mockRevalidatePath: jest.MockedFunction<any>;
  let mockGetToken: jest.MockedFunction<any>;
  let mockUpdatePasswordSchema: jest.MockedFunction<any>;

  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();

    const { revalidatePath } = require("next/cache");
    mockRevalidatePath = revalidatePath;

    const getToken = require("../libs/auth/token").default;
    mockGetToken = getToken;

    const { UpdatePasswordSchema } = require("../libs/schemas/auth");
    mockUpdatePasswordSchema = UpdatePasswordSchema.safeParse;

    mockFormData = new FormData();
    mockFormData.append("current_password", "Test Password");
    mockFormData.append("password", "New Password");
    mockFormData.append("password_confirmation", "New Password");

    process.env.API_URL = "http://localhost:4000/api";
    mockGetToken.mockResolvedValue("mock-token");
  });

  it("正常にパスワードを更新できること", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: "パスワードが更新されました" }),
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/update-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({
          current_password: "Test Password",
          password: "New Password",
          password_confirmation: "New Password",
        }),
      },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");

    expect(result).toEqual({
      errors: [],
      success: "パスワードが更新されました",
    });
  });

  it("バリデーションエラーが発生した場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: false,
      error: {
        issues: [
          { message: "現在のパスワードは必須です" },
          { message: "再設定するパスワードは必須です" },
        ],
      },
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual({
      errors: ["現在のパスワードは必須です", "再設定するパスワードは必須です"],
      success: "",
    });
  });

  it("パスワードが短かった場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: false,
      error: {
        issues: [
          { message: "現在のパスワードは8文字以上である必要があります" },
          { message: "新しいパスワードは8文字以上である必要があります" },
        ],
      },
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual({
      errors: [
        "現在のパスワードは8文字以上である必要があります",
        "新しいパスワードは8文字以上である必要があります",
      ],
      success: "",
    });
  });

  it("パスワードが一致しない場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: false,
      error: {
        issues: [{ message: "パスワードが一致しません" }],
      },
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual({
      errors: ["パスワードが一致しません"],
      success: "",
    });
  });

  it("現在のパスワードが間違っている場合（API側エラー）", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Wrong Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      errors: ["APIエラー: 401 Unauthorized"],
      success: "",
    });
  });

  it("サーバーエラーが発生した場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: ["APIエラー: 500 Internal Server Error"],
      success: "",
    });
  });

  it("ネットワークエラーが発生した場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    });
  });

  it("トークンが取得できない場合", async () => {
    mockGetToken.mockResolvedValue(null);

    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/update-password`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer null",
        }),
      }),
    );

    expect(result).toEqual({
      errors: ["APIエラー: 401 Unauthorized"],
      success: "",
    });
  });

  it("APIからmessageプロパティで成功レスポンスが返される場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "パスワードの更新に成功しました" }),
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードの更新に成功しました",
    });
  });

  it("APIから文字列で成功レスポンスが返される場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => "パスワード変更完了",
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [],
      success: "パスワード変更完了",
    });
  });

  it("APIから予期しない形式のレスポンスが返される場合", async () => {
    mockUpdatePasswordSchema.mockReturnValue({
      success: true,
      data: {
        current_password: "Test Password",
        password: "New Password",
        password_confirmation: "New Password",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpectedProperty: "value" }),
    });

    const result = await updatePassword(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [],
      success: "パスワードが更新されました",
    });
  });
});
