"use server";

import { Budget, DraftBudgetSchema } from "libs/schemas/auth";
import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";

type ActionStateType = {
  errors: string[];
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
  const url = `${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}`;

  try {
    const req = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget.data),
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
          success: json.message || json.success || "更新が完了しました",
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
    console.error("Budget update error:", error);
    return {
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    };
  }
}
