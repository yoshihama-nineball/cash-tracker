// page.tsx (Server Component として残す)
import { getBudget } from "@/services/budget";
import BudgetDetailsClient from "../../../../components/budgets/BudgetDetailsClient";

export default async function BudgetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const budget = await getBudget(params.id);

  return <BudgetDetailsClient budget={budget} />;
}
