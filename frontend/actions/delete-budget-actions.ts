"use server";

import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";
import { Budget } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function deleteBudget(
  budgetId: Budget["id"],
  prevState: ActionStateType,
  formData: FormData, // これは使用しない
) {
  const token = await getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}`;

  try {
    const req = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // ボディは不要
    });

    if (!req.ok) {
      return {
        errors: [`APIエラー: ${req.status} ${req.statusText}`],
        success: "",
      };
    }

    let json;
    try {
      // レスポンスボディがあれば解析
      json = await req.json();
    } catch (error) {
      // レスポンスボディがない場合（204 No Contentなど）
      if (req.ok) {
        revalidatePath("/admin");
        return {
          errors: [],
          success: "予算を削除しました",
        };
      }
    }

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
          success: json.message || json.success || "予算を削除しました",
        };
      }
    }

    return {
      errors: [],
      success: "予算を削除しました",
    };
  } catch (error) {
    console.error("Budget delete error:", error);
    return {
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    };
  }
}
