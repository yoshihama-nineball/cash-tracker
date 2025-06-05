// app/admin/budgets/[id]/edit/page.tsx
import EditBudgetForm from "@/components/budgets/EditBudgetForm";
import { getBudget } from "libs/api";

export default async function EditBudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const budget = await getBudget(id);
  console.log(budget, "IDの予算");

  return (
    <>
      <EditBudgetForm budget={budget} />
    </>
  );
}
