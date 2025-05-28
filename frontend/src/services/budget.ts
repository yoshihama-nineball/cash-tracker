import getToken from "libs/auth/token";
import { notFound } from "next/navigation";
import { cache } from "react";

// services/budget.ts
export const getBudget = cache(async (budgetId: string) => {
  try {
    const token = await getToken();

    if (!token) {
      console.error("No token found");
      notFound();
    }

    const url = `${process.env.API_URL}/budgets/${budgetId}`;

    const req = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!req.ok) {
      notFound();
    }

    const responseText = await req.text();

    if (!responseText) {
      console.error("Empty response from API");
      notFound();
    }

    const json = JSON.parse(responseText);

    return json;
  } catch (error) {
    console.error("Error in getBudget:", error);
    notFound();
  }
});
