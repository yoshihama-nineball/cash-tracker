"use server";

import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";
import { Budget, DraftExpenseSchema, Expense } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function editExpense(
  budgetId: Budget["id"],
  expenseId: Expense["id"],
  prevState: ActionStateType,
  formData: FormData,
) {
  const expense = DraftExpenseSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
  });

  if (!expense.success) {
    return {
      errors: expense.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;

  try {
    const req = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense.data),
    });

    if (!req.ok) {
      return {
        errors: [`APIエラー: ${req.status} ${req.statusText}`],
        success: "",
      };
    }

    const json = await req.json();

    revalidatePath("/admin");

    if (typeof json === "string") {
      return {
        errors: [],
        success: json,
      };
    } else if (typeof json === "object" && json !== null) {
      if ("success" in json || "message" in json) {
        return {
          errors: [],
          success: json.message || json.success || "支出の編集に成功しました",
        };
      }
    }

    return {
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    };
  } catch (error) {
    console.error("Expense update error:", error);
    return {
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    };
  }
}
