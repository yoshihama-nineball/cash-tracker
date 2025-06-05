"use server";

import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";
import { DraftBudgetSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function createBudget(
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
  const url = `${process.env.NEXT_PUBLIC_API_URL}/budgets`;

  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: budget.data.name,
      amount: budget.data.amount,
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
