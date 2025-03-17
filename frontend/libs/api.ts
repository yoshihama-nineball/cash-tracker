// lib/api.ts
import axios from 'axios'; // axios をインストール: npm install axios
import { BudgetsResponse } from '../types/budget';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = 'http://localhost:5000/api';

export async function getBudgets(): Promise<BudgetsResponse> {
  try {
    // fetch の代わりに axios を使用
    const { data } = await axios.get(`${API_URL}/budgets`);
    return data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return { budgets: [], count: 0 };
  }
}

// クライアントコンポーネントから呼び出す場合のバージョン
export async function createBudget(budget: CreateBudgetRequest, token: string): Promise<Budget> {
  const res = await fetch(`${API_URL}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '予算の作成に失敗しました');
  }

  const data = await res.json();
  return data.budget;
}