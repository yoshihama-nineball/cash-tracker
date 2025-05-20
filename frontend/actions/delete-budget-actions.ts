import { editBudget } from 'actions/edit-budget-action';

"use server"

import { Budget, DraftBudgetSchema } from "../libs/schemas/auth"
import { revalidatePath } from "next/cache"
import getToken from "../libs/auth/token"

type ActionStateType = {
  errors: string[];
  success: string;
}

export async function deleteBudget(
  budgetId: Budget["id"],
  prevState: ActionStateType,
  formData: FormData,
) {
  const budget = DraftBudgetSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
  });

  if(!budget.success) {
    return {
      errors: budget.error.issues.map((issue) => issue.message),
      success: ""
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}`;

  try {
    const req = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget.data),
    });

    //MEMO: 続き！！！！！！！！

    if()
  }
}