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

  // デバッグ情報を追加
  console.log("予算作成レスポンスステータス:", req.status);
  console.log("予算作成レスポンスOK:", req.ok);

  const json = await req.json();
  console.log("予算作成レスポンス内容:", json); // ← 追加
  console.log("レスポンスの型:", typeof json); // ← 追加

  revalidatePath("/admin");

  // エラーレスポンスの処理を追加
  if (!req.ok) {
    return {
      errors: [json.message || `サーバーエラー (${req.status})`],
      success: "",
    };
  }

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

  // デバッグ用：実際のレスポンス内容をエラーメッセージに含める
  return {
    errors: [`レスポンス形式が予期しないものでした: ${JSON.stringify(json)}`],
    success: "",
  };
}
