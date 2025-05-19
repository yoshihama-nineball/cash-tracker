// lib/api.ts
import { notFound } from "next/navigation";
import { cache } from "react";
import { Budget, CreateBudgetRequest } from "../types/budget";
import getToken from "./auth/token";
import { BudgetAPIResponseSchema } from "./schemas/auth";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = "http://localhost:4000/api";

export async function getBudgets() {
  try {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["all-budgets"],
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response data:", data); // デバッグ用

    // APIからのレスポンスが直接配列の場合
    if (Array.isArray(data)) {
      return { budgets: data };
    }

    // データにbudgetsプロパティがある場合はそのまま返す
    if (data && data.budgets) {
      return data;
    }

    // それ以外の場合は、データ全体をbudgetsとして扱う
    return { budgets: data };
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    // エラー時は空の予算リストを返す
    return { budgets: [] };
  }
}

// クライアントコンポーネントから呼び出す場合のバージョン
export async function createBudget(
  budget: CreateBudgetRequest,
  token: string,
): Promise<Budget> {
  const res = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "予算の作成に失敗しました");
  }

  const data = await res.json();
  return data.budget;
}

export const getBudget = cache(async (budgetId: string) => {
  // getToken()を await
  const token = await getToken();

  const url = `${process.env.API_URL}/budgets/${budgetId}`;
  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!req.ok) {
    notFound();
  }

  const json = await req.json();
  const budget = BudgetAPIResponseSchema.parse(json);
  return budget;
});
