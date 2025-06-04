// frontend/types/budget.ts
// import { Expense } from "./expense";

import { Budget } from "./budget";
import { User } from "./user";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  budgetId: string;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
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
