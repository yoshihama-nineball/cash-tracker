// app/budgets/[id]/page.tsx
import CreateExpenseForm from "@/components/expense/CreateExpenseForm";
import { Box, Container, Typography } from "@mui/material";
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
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            {budget.name}
          </Typography>
          <CreateExpenseForm />
        </Box>
        {/* <BudgetDetails budget={budget} /> */}
        <Typography>予算の使用率グラフ表示コンポーネント</Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            支出一覧コンポーネント
          </Typography>
          {/* MEMO: ↑isMobileを渡す */}
        </Box>
      </Container>
    </>
  );
}
