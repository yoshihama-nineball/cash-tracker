"use server";

import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";
import { Budget, Expense } from "../libs/schemas//auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function deleteExpense(
  budgetId: Budget["id"],
  expenseId: Expense["id"],
  prevState: ActionStateType,
  formData: FormData,
) {
  if (!budgetId || !expenseId) {
    return {
      errors: ["予算IDまたは支出IDが不正です"],
      success: "",
    };
  }

  const token = await getToken();

  if (!token) {
    return {
      errors: ["認証に失敗しました"],
      success: "",
    };
  }

  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;

  try {
    const req = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!req.ok) {
      console.error("API error:", req.status, req.statusText);
      return {
        errors: [`APIエラー: ${req.status} ${req.statusText}`],
        success: "",
      };
    }
    revalidatePath("/admin");

    return {
      errors: [],
      success: "支出の削除に成功しました",
    };
  } catch (error) {
    console.error("削除エラー:", error);
    return {
      errors: ["削除にエラーが発生しました"],
      success: "",
    };
  }
}
