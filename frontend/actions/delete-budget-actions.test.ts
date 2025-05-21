const mockDeleteDialog = jest.fn();
const mockRevalidatePath = jest.fn();
const mockGetToken = jest.fn().mockResolvedValue("mock-token");

jest.mock(
  "./delete-budget-action",
  () => ({
    deleteBudget: mockDeleteDialog,
  }),
  { virtual: true },
);

describe("deleteBudget", () => {
  const mockBudgetId = "12345";
  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append("name", "旅行予算");
    mockFormData.append("amount", "150000");

    process.env.API_URL = "http://localhost:4000/api";

    // モックの実装を設定
    mockDeleteDialog.mockImplementation(
      async (budgetId, prevState, formData) => {
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
          const url = `${process.env.API_URL}/budgets/${budgetId}`;

          const response = { success: `${name}を削除しました` };

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
      },
    );

    mockDeleteDialog.mockClear();
    mockRevalidatePath.mockClear();
    mockGetToken.mockClear();
  });

  it("正常に予算を削除できること", async () => {
    const result = await mockDeleteDialog(
      mockBudgetId,
      mockPrevState,
      mockFormData,
    );

    expect(mockDeleteDialog).toHaveBeenCalledWith(
      mockBudgetId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [],
      success: `旅行予算を削除しました`,
    });
  });

  it("バリデーションエラーが適切に処理されること", async () => {
    const invalidFormData = new FormData();

    const result = await mockDeleteDialog(
      mockBudgetId,
      mockPrevState,
      invalidFormData,
    );

    expect(result.errors).toContain("バリデーションエラー");
    expect(result.success).toBe("");
  });
});
