// app/admin/budgets/page.tsx
import BudgetList from "@/components/budgets/BudgetList";
import BudgetSkeleton from "@/components/budgets/BudgetSkeleton";
import Button from "@/components/ui/Button/Button";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";
import { getUserBudgets } from "../../../../actions/get-budgets-action";

export default async function BudgetsPage() {
  let budgetsData;
  try {
    budgetsData = await getUserBudgets();
  } catch (error) {
    console.error("予算データの取得中にエラーが発生:", error);
    budgetsData = { budgets: [] };
  }

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
            予算一覧
          </Typography>
          <Link href="/admin/budgets/new">
            <Button
              variant="contained"
              sx={{
                bgcolor: "#8e8edb",
                color: "white",
                borderRadius: 4,
                py: 1,
                px: 3,
                "&:hover": { bgcolor: "#7070c0" },
              }}
            >
              新規予算作成
            </Button>
          </Link>
        </Box>
        <Suspense fallback={<BudgetSkeleton />}>
          <BudgetList budgets={budgetsData} />
        </Suspense>
      </Box>
    </Container>
  );
}
