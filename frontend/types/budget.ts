// frontend/types/budget.tsをbackend/src/models/budget.tsをもとに実装
import { Expense } from "./expense";
import { User } from "./user";

export interface Budget {
  id: number;
  name: string;
  amount: number;
  expenses?: Expense[];
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// 新しい予算を作成する際に使用する型（IDと自動生成されるフィールドを除外）
export interface CreateBudgetRequest {
  name: string;
  amount: number;
  userId: number;
}

// 予算を更新する際に使用する型（部分的な更新を許可）
export interface UpdateBudgetRequest {
  name?: string;
  amount?: number;
}

// APIからのレスポンスタイプ
export interface BudgetResponse {
  budget: Budget;
}

// 複数の予算を取得する際のレスポンスタイプ
export interface BudgetsResponse {
  budgets: Budget[];
  totalCount: number;
}
