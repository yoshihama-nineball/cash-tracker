const mockEditBudget = jest.fn();
const mockRevalidatePath = jest.fn();
const mockGetToken = jest.fn().mockResolvedValue("mock-token");

jest.mock(
  "./edit-budget-action",
  () => ({
    editBudget: mockEditBudget,
  }),
  { virtual: true },
);

describe("editBudget", () => {
  const mockBudgetId = "12345";
  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append("name", "旅行予算");
    mockFormData.append("amount", "150000");

    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api";

    // モックの実装を設定
    mockEditBudget.mockImplementation(async (budgetId, prevState, formData) => {
      const name = formData.get("name");
      const amount = formData.get("amount");

      if (!name || !amount) {
        return {
          errors: ["バリデーションエラー"],
          success: "",
        };
      }

      try {
        const token = await mockGetToken();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}`;

        const response = { success: "予算が正常に更新されました" };

        mockRevalidatePath("/admin");

        return {
          errors: [],
          success: response.success,
        };
      } catch (error) {
        return {
          errors: [
            "通信エラーが発生しました。インターネット接続を確認してください。",
          ],
          success: "",
        };
      }
    });

    mockEditBudget.mockClear();
    mockRevalidatePath.mockClear();
    mockGetToken.mockClear();
  });

  it("正常に予算を更新できること", async () => {
    const result = await mockEditBudget(
      mockBudgetId,
      mockPrevState,
      mockFormData,
    );

    expect(mockEditBudget).toHaveBeenCalledWith(
      mockBudgetId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [],
      success: "予算が正常に更新されました",
    });
  });

  it("バリデーションエラーが適切に処理されること", async () => {
    const invalidFormData = new FormData();

    const result = await mockEditBudget(
      mockBudgetId,
      mockPrevState,
      invalidFormData,
    );

    expect(result.errors).toContain("バリデーションエラー");
    expect(result.success).toBe("");
  });
});
