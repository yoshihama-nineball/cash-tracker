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
  formData: FormData,
) {
  try {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}`;

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
      success: "予算を削除しました",
    };
  } catch (error) {
    console.error("削除エラー:", error);
    return {
      errors: ["削除中にエラーが発生しました"],
      success: "",
    };
  }
}
