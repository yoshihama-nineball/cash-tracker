// app/budgets/page.tsx
import Button from "@/components/ui/Button/Button";
import { Box, Container, Typography } from "@mui/material";
import getToken from "libs/auth/token";
import Link from "next/link";
import { Suspense } from "react";
import BudgetList from "../../../components/budgets/BudgetList";
import BudgetSkeleton from "../../../components/budgets/BudgetSkeleton";

export const metadata = {
  title: "予算一覧 | 家計簿アプリ",
  description: "予算の一覧を確認・管理できます",
};

// getUserBudgets関数の修正
async function getUserBudgets() {
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

export default async function BudgetsPage() {
  // データの重複取得を防止
  let budgetsData;
  try {
    budgetsData = await getUserBudgets();
    console.log("処理後の予算データ:", budgetsData);
  } catch (error) {
    console.error("予算データの処理中にエラーが発生:", error);
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
          <Typography variant="h4">予算一覧</Typography>
          <Link
            href="/admin/budgets/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Button variant="primary">新規予算作成</Button>
          </Link>
        </Box>

        <Suspense fallback={<BudgetSkeleton />}>
          <BudgetList budgets={budgetsData} />
        </Suspense>
      </Box>
    </Container>
  );
}
