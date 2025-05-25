import CreateExpenseForm from "@/components/expense/CreateExpenseForm";
import ExpenseList from "@/components/expense/ExpenseList";
import { getBudget } from "@/services/budget";
import { Box, Container, Typography } from "@mui/material";

export default async function BudgetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  const budget = await getBudget(params.id);
  console.log(budget.expenses, "IDによる支出取得");

  return (
    <>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            {budget.name}
          </Typography>
          <CreateExpenseForm budgetId={budget.id} />
        </Box>
        {/* <BudgetDetails budget={budget} /> */}
        <ExpenseList budget={budget} />
      </Container>
    </>
  );
}
