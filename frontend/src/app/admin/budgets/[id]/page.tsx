import { getBudget } from "@/services/budget";
import BudgetDetailsClient from "../../../../components/budgets/BudgetDetailsClient";

export default async function BudgetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const budget = await getBudget(id);

  return <BudgetDetailsClient budget={budget} />;
}
