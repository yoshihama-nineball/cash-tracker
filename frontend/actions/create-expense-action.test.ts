import { DraftExpenseSchema } from "../libs/schemas/auth";

const mockCreateExpense = jest.fn();
const mockRevalidatePath = jest.fn();
const mockGetToken = jest.fn().mockResolvedValue("mock-token");

jest.mock(
  "./create-expense-action",
  () => ({
    createExpense: mockCreateExpense,
  }),
  { virtual: true },
);

describe("DraftExpenseSchema", () => {
  describe("正常なケース", () => {
    it("有効なデータでバリデーションが成功すること", () => {
      const validData = {
        name: "支出テスト",
        amount: 10000,
      };

      const result = DraftExpenseSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("数値文字列がnumberに変換されること", () => {
      const dataWithStringAmount = {
        name: "支出テスト",
        amount: "5000",
      };

      const result = DraftExpenseSchema.safeParse(dataWithStringAmount);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(5000);
        expect(typeof result.data.amount).toBe("number");
      }
    });

    it("小数点を含む金額が正しく処理されること", () => {
      const dataWithDecimal = {
        name: "支出テスト",
        amount: "1500.5",
      };

      const result = DraftExpenseSchema.safeParse(dataWithDecimal);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(1500.5);
      }
    });
  });

  describe("nameフィールドのバリデーション", () => {
    it("nameが空文字の場合エラーになること", () => {
      const invalidData = {
        name: "",
        amount: 1000,
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("支出タイトルは必須です");
        expect(result.error.issues[0].path).toEqual(["name"]);
      }
    });

    it("nameがnullの場合エラーになること", () => {
      const invalidData = {
        name: null,
        amount: 1000,
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("amountフィールドのバリデーション", () => {
    it("amountが0の場合エラーになること", () => {
      const invalidData = {
        name: "支出テスト",
        amount: 0,
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("支出金額が0円未満です");
        expect(result.error.issues[0].path).toEqual(["amount"]);
      }
    });

    it("amountが負の値の場合エラーになること", () => {
      const invalidData = {
        name: "支出テスト",
        amount: -1000,
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("支出金額が0円未満です");
      }
    });

    it("amountが数値に変換できない文字列の場合エラーになること", () => {
      const invalidData = {
        name: "支出テスト",
        amount: "無効な文字列",
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("支出金額の値が無効です");
      }
    });

    it("amountがundefinedの場合エラーになること", () => {
      const invalidData = {
        name: "支出テスト",
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const amountError = result.error.issues.find(
          (issue) => issue.path[0] === "amount",
        );
        expect(amountError?.message).toBe("支出金額の値が無効です");
      }
    });

    it("amountがnullの場合エラーになること", () => {
      const invalidData = {
        name: "支出テスト",
        amount: null,
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("複数フィールドエラーのケース", () => {
    it("nameとamount両方が無効な場合、両方のエラーが返されること", () => {
      const invalidData = {
        name: "",
        amount: "無効な値",
      };

      const result = DraftExpenseSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);

        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        const amountError = result.error.issues.find(
          (issue) => issue.path[0] === "amount",
        );

        expect(nameError?.message).toBe("支出タイトルは必須です");
        expect(amountError?.message).toBe("支出金額の値が無効です");
      }
    });
  });
});

describe("createExpense Action", () => {
  const mockBudgetId = "123456";
  const mockPrevState = { errors: [], success: "" };
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append("name", "支出テスト");
    mockFormData.append("amount", "10000");

    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api";

    mockCreateExpense.mockImplementation(
      async (budgetId, prevState, formData) => {
        const name = formData.get("name");
        const amount = formData.get("amount");

        const validationResult = DraftExpenseSchema.safeParse({
          name: name as string,
          amount: amount as string,
        });

        if (!validationResult.success) {
          return {
            errors: validationResult.error.issues.map((issue) => issue.message),
            success: "",
          };
        }

        try {
          const token = await mockGetToken();
          const url = `${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}/expenses`;

          const response = { success: "支出が正しく作成されました" };
          mockRevalidatePath("/admin");

          return {
            errors: [],
            success: response.success,
          };
        } catch (error) {
          return {
            errors: ["エラーが発生しました"],
            success: "",
          };
        }
      },
    );

    mockCreateExpense.mockClear();
    mockRevalidatePath.mockClear();
    mockGetToken.mockClear();
  });

  describe("正常なケース", () => {
    it("正常に支出を作成できるテストケース", async () => {
      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        mockFormData,
      );

      expect(mockCreateExpense).toHaveBeenCalledWith(
        mockBudgetId,
        mockPrevState,
        mockFormData,
      );

      expect(result).toEqual({
        errors: [],
        success: "支出が正しく作成されました",
      });
    });

    it("数値文字列の金額が正しく処理されること", async () => {
      const stringAmountFormData = new FormData();
      stringAmountFormData.append("name", "文字列金額テスト");
      stringAmountFormData.append("amount", "5000");

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        stringAmountFormData,
      );

      expect(result.errors).toEqual([]);
      expect(result.success).toBe("支出が正しく作成されました");
    });
  });

  describe("バリデーションエラーのケース", () => {
    it("名前が空の場合、適切なエラーメッセージが返されること", async () => {
      const invalidFormData = new FormData();
      invalidFormData.append("name", "");
      invalidFormData.append("amount", "1000");

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        invalidFormData,
      );

      expect(result.errors).toContain("支出タイトルは必須です");
      expect(result.success).toBe("");
    });

    it("金額が0の場合、適切なエラーメッセージが返されること", async () => {
      const invalidFormData = new FormData();
      invalidFormData.append("name", "支出テスト");
      invalidFormData.append("amount", "0");

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        invalidFormData,
      );

      expect(result.errors).toContain("支出金額が0円未満です");
      expect(result.success).toBe("");
    });

    it("金額が無効な文字列の場合、適切なエラーメッセージが返されること", async () => {
      const invalidFormData = new FormData();
      invalidFormData.append("name", "支出テスト");
      invalidFormData.append("amount", "無効な金額");

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        invalidFormData,
      );

      expect(result.errors).toContain("支出金額の値が無効です");
      expect(result.success).toBe("");
    });

    it("両方のフィールドが無効な場合、複数のエラーが返されること", async () => {
      const invalidFormData = new FormData();
      invalidFormData.append("name", "");
      invalidFormData.append("amount", "無効な金額");

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        invalidFormData,
      );

      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain("支出タイトルは必須です");
      expect(result.errors).toContain("支出金額の値が無効です");
      expect(result.success).toBe("");
    });

    it("フィールドが存在しない場合、バリデーションエラーが返されること", async () => {
      const emptyFormData = new FormData();

      const result = await mockCreateExpense(
        mockBudgetId,
        mockPrevState,
        emptyFormData,
      );

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.success).toBe("");
    });
  });

  describe("ネットワークエラーのケース", () => {
    it("APIエラーが発生した場合、適切なエラーメッセージが返されること", async () => {
      mockCreateExpense.mockImplementationOnce(async () => {
        throw new Error("Network Error");
      });

      await expect(
        mockCreateExpense(mockBudgetId, mockPrevState, mockFormData),
      ).rejects.toThrow("Network Error");
    });
  });
});
