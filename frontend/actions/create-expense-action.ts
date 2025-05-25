"use server";

import { DraftExpenseSchema } from "libs/schemas/auth";
import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function createExpense(
  budgetId: number,
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
      success: ",",
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`;
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: expense.data.name,
      amount: expense.data.amount,
    }),
  });

  const json = await req.json();

  revalidatePath("/admin");

  if (typeof json === "string") {
    return {
      errors: [],
      success: json,
    };
  } else if (json && typeof json === "object") {
    if ("success" in json && typeof json.success === "string") {
      return {
        errors: [],
        success: json.success,
      };
    } else if ("message" in json && typeof json.message === "string") {
      return {
        errors: [],
        success: json.message,
      };
    }
  }

  return {
    errors: [
      "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
    ],
    success: "",
  };
}
