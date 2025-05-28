// app/admin/budgets/[id]/edit/page.tsx
import EditBudgetForm from "@/components/budgets/EditBudgetForm";
import { getBudget } from "libs/api";

export default async function EditBudgetPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  const budget = await getBudget(id);
  console.log(budget, "IDの予算");

  return (
    <>
      <EditBudgetForm budget={budget} />
    </>
  );
}
