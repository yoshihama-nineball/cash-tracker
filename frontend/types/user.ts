// frontend/types/user.ts
import { Budget } from "./budget";

export interface User {
  _id: string;
  name: string;
  email: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  budgets?: Budget[]; // 関連するBudgetの配列
}

// ユーザー登録リクエスト用の型
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface ConfirmAccountRequest {
  token: string; //MEMO: numberの可能性
}

// ログインリクエスト用の型
export interface LoginRequest {
  email: string;
  password: string;
}

// ユーザー認証レスポンス用の型
export interface AuthResponse {
  user: User;
  token: string;
}

// ユーザー更新リクエスト用の型
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

// パスワードリセット用の型
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}
