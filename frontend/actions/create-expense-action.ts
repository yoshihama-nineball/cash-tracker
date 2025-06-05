"use server";
import { DraftExpenseSchema } from "libs/schemas/auth";
import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function createExpense(
  budgetId: string,
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log('createExpense開始 - budgetId:', budgetId);
  console.log('formData:', {
    name: formData.get("name"),
    amount: formData.get("amount"),
  });

  try {
    const expense = DraftExpenseSchema.safeParse({
      name: formData.get("name"),
      amount: formData.get("amount"),
    });

    console.log('expense.success:', expense.success);

    if (!expense.success) {
      console.log('バリデーションエラー:', expense.error);
      return {
        errors: expense.error.issues.map((issue) => issue.message),
        success: "",
      };
    }

    console.log('バリデーション成功:', expense.data);

    const token = await getToken();
    console.log('token取得:', !!token);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}/expenses`;
    console.log('URL:', url);

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

    console.log('レスポンスステータス:', req.status);
    
    const json = await req.json();
    console.log('レスポンス内容:', json);

    revalidatePath("/admin");

    if (!req.ok) {
      const errorMessage = json.errors?.[0]?.msg || json.message || `サーバーエラー (${req.status})`;
      console.log('エラーレスポンス:', errorMessage);
      return {
        errors: [errorMessage],
        success: "",
      };
    }

    const result = {
      errors: [],
      success: "支出を作成しました",
    };
    console.log('最終結果:', result);
    return result;

  } catch (error) {
    console.error('createExpense内でエラー:', error);
    return {
      errors: ["予期しないエラーが発生しました"],
      success: "",
    };
  }
}