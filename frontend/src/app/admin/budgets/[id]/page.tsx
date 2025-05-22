// app/budgets/[id]/page.tsx
import { Typography } from "@mui/material";
import { getBudget } from "libs/api";

export default async function BudgetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  const budget = await getBudget(id);

  return (
    <>
      <Typography>{budget.name}</Typography>
      {/* <BudgetDetails budget={budget} /> */}
    </>
  );
}
