import { editExpense } from "./edit-expense-action";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("../libs/auth/token", () => ({
  __esModule: true,
  default: jest.fn(),
}));

global.fetch = jest.fn();

describe("editExpense", () => {
  let mockRevalidatePath: jest.MockedFunction<any>;
  let mockGetToken: jest.MockedFunction<any>;

  const mockBudgetId = "12345";
  const mockExpenseId = "67890";
  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();

    const { revalidatePath } = require("next/cache");
    mockRevalidatePath = revalidatePath;

    const getToken = require("../libs/auth/token").default;
    mockGetToken = getToken;

    mockFormData = new FormData();
    mockFormData.append("name", "テスト支出");
    mockFormData.append("amount", "1000");

    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api";
    mockGetToken.mockResolvedValue("mock-token");
  });

  it("正常に支出を更新できること", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: "支出の編集に成功しました" }),
    });

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/budgets/${mockBudgetId}/expenses/${mockExpenseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({
          name: "テスト支出",
          amount: 1000,
        }),
      },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");

    expect(result).toEqual({
      errors: [],
      success: "支出の編集に成功しました",
    });
  });

  it("バリデーションエラーが適切に処理されること", async () => {
    const invalidFormData = new FormData();

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      invalidFormData,
    );

    expect(fetch).not.toHaveBeenCalled();

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.success).toBe("");
  });

  it("APIエラーが適切に処理されること", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: ["APIエラー: 404 Not Found"],
      success: "",
    });
  });

  it("通信エラーが適切に処理されること", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    });
  });

  it("レスポンスが文字列の場合、適切に処理されること", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => "支出を更新しました",
    });

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [],
      success: "支出を更新しました",
    });
  });

  it("予期しないレスポンス形式が適切に処理されること", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpectedProperty: "value" }),
    });

    const result = await editExpense(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    });
  });

  it("tokenの取得が正しく行われること", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: "OK" }),
    });

    await editExpense(mockBudgetId, mockExpenseId, mockPrevState, mockFormData);

    expect(mockGetToken).toHaveBeenCalled();
  });
});
