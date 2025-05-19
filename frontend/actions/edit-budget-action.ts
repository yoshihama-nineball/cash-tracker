"use server";

import getToken from "libs/auth/token";
import { Budget, DraftBudgetSchema } from "libs/schemas/auth";
import { revalidatePath } from "next/cache";

type ActionStateType = {
  errors: string;
  success: string;
};

export async function editBudget(
  budgetId: Budget["id"],
  prevState: ActionStateType,
  formData: FormData,
) {
  const budget = DraftBudgetSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
  });
  if (!budget.success) {
    return {
      errors: budget.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}`;

  const req = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await req.json();

  revalidatePath("/admin");

  if (typeof json === "string") {
    return {
      errors: [],
      success: json,
    };
  } else if (json && json === "object") {
    if ("success" in json && typeof json === "object") {
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
