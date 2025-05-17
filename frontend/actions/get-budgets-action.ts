// app/actions/get-budgets-action.ts
"use server";

import getToken from "../libs/auth/token";

export async function getUserBudgets() {
  try {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets`;

    const req = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["all-budgets"],
      },
    });

    if (!req.ok) {
      throw new Error(`API request failed with status ${req.status}`);
    }

    const json = await req.json();
    console.log("API原始データ:", json);

    if (Array.isArray(json)) {
      return { budgets: json };
    } else if (json && typeof json === "object") {
      if (json.budgets) {
        return json;
      } else {
        return { budgets: [json] };
      }
    }

    return { budgets: [] };
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return { budgets: [] };
  }
}