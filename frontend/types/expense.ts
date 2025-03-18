// frontend/types/budget.ts
import { Expense } from "./expense";

export interface Budget {
  _id: string;
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expenses?: Expense[]; // 関連するExpenseの配列
}

// 予算作成リクエスト用の型
export interface CreateBudgetRequest {
  name: string;
  amount: number;
}

// 予算更新リクエスト用の型
export interface UpdateBudgetRequest {
  name?: string;
  amount?: number;
}

// 予算レスポンス用の型
export interface BudgetResponse {
  budget: Budget;
}

// 複数予算レスポンス用の型
export interface BudgetsResponse {
  budgets: Budget[];
  count?: number;
}
