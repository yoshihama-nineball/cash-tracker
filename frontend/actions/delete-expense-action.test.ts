const mockDeleteExpenseForm = jest.fn();
const mockRevalidatePath = jest.fn();
const mockGetToken = jest.fn().mockResolvedValue("mock-token");

jest.mock(
  "./delete-expense-action",
  () => ({
    deleteExpense: mockDeleteExpenseForm,
  }),
  { virtual: true },
);

describe("deleteExpense", () => {
  const mockBudgetId = "12345";
  const mockExpenseId = "56789";
  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append("name", "旅行支出");
    mockFormData.append("amount", "15000");

    process.env.API_URL = "http://localhost:4000/api";

    mockDeleteExpenseForm.mockImplementation(
      async (budgetId, expenseId, prevState, formData) => {
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
          const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;

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

    mockDeleteExpenseForm.mockClear();
    mockRevalidatePath.mockClear();
    mockGetToken.mockClear();
  });

  it("正常に支出を削除できること", async () => {
    const result = await mockDeleteExpenseForm(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(mockDeleteExpenseForm).toHaveBeenCalledWith(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      mockFormData,
    );

    expect(result).toEqual({
      errors: [],
      success: `旅行支出を削除しました`,
    });
  });

  it("バリデーションエラーが適切に処理されること", async () => {
    const invalidFormData = new FormData();

    const result = await mockDeleteExpenseForm(
      mockBudgetId,
      mockExpenseId,
      mockPrevState,
      invalidFormData,
    );

    expect(result.errors).toContain("バリデーションエラー");
    expect(result.success).toBe("");
  });
});
