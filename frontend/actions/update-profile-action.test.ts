import { updateProfile } from "./update-profile-action";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("../libs/auth/token", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// UpdateProfileSchemaのモック
jest.mock("../libs/schemas/auth", () => ({
  UpdateProfileSchema: {
    safeParse: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("updateProfile", () => {
  let mockRevalidatePath: jest.MockedFunction<any>;
  let mockGetToken: jest.MockedFunction<any>;
  let mockUpdateProfileSchema: jest.MockedFunction<any>;

  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();

    const { revalidatePath } = require("next/cache");
    mockRevalidatePath = revalidatePath;

    const getToken = require("../libs/auth/token").default;
    mockGetToken = getToken;

    const { UpdateProfileSchema } = require("../libs/schemas/auth");
    mockUpdateProfileSchema = UpdateProfileSchema.safeParse;

    mockFormData = new FormData();
    mockFormData.append("name", "Test User");
    mockFormData.append("email", "test@example.com");

    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api";
    mockGetToken.mockResolvedValue("mock-token");
  });

  it("正常にユーザ情報を更新できること", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: "プロフィールが更新されました" }),
    });

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
        }),
      },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");

    expect(result).toEqual({
      errors: [],
      success: "プロフィールが更新されました",
    });
  });

  it("バリデーションエラーが発生した場合", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: false,
      error: {
        issues: [
          { message: "名前は必須です" },
          { message: "メールアドレスの形式が正しくありません" },
        ],
      },
    });

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual({
      errors: ["名前は必須です", "メールアドレスの形式が正しくありません"],
      success: "",
    });
  });

  it("APIエラーが発生した場合", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: ["APIエラー: 400 Bad Request"],
      success: "",
    });
  });

  it("ネットワークエラーが発生した場合", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    });
  });

  it("レスポンスがmessageフィールドを含む場合", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "プロフィールが正常に更新されました" }),
    });

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [],
      success: "プロフィールが正常に更新されました",
    });
  });

  it("予期しないレスポンス形式の場合", async () => {
    mockUpdateProfileSchema.mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
      },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpectedField: "some value" }),
    });

    const result = await updateProfile(mockPrevState, mockFormData);

    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });
});
