"use client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Budget } from "types/budget";

interface ExpenseListProps {
  budget?: Budget;
}

const ExpenseList = ({ budget }: ExpenseListProps) => {
  const [sortField, setSortField] = useState<"name" | "amount">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: "name" | "amount") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 早期リターン: budgetが存在しない場合
  if (!budget) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>予算データが見つかりません</Typography>
      </Box>
    );
  }

  // expensesの安全な取得
  const expenses = budget.expenses || [];

  // ソート処理
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  return (
    <>
      <Typography>予算の使用率グラフ表示コンポーネント</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          支出一覧 ({expenses.length}件)
        </Typography>

        {expenses.length === 0 ? (
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            まだ支出がありません
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%",
              boxShadow: 2,
              mt: 2,
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "primary.light" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      width: "40%",
                    }}
                  >
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortDirection : "asc"}
                      onClick={() => toggleSort("name")}
                      sx={{
                        color: "white !important",
                        "&.MuiTableSortLabel-active": {
                          color: "white !important",
                        },
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      支出名
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      width: "20%",
                    }}
                  >
                    <TableSortLabel
                      active={sortField === "amount"}
                      direction={sortField === "amount" ? sortDirection : "asc"}
                      onClick={() => toggleSort("amount")}
                      sx={{
                        color: "white !important",
                        "&.MuiTableSortLabel-active": {
                          color: "white !important",
                        },
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      金額
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      width: "25%",
                    }}
                  >
                    作成日
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      width: "15%",
                    }}
                  >
                    アクション
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedExpenses.map((expense) => (
                  <TableRow
                    key={expense._id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:nth-of-type(odd)": { backgroundColor: "#f8f8f8" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography sx={{ fontWeight: "medium" }}>
                        {expense.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      ¥{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(expense.createdAt).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell align="center">
                      <Typography>🔧</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default ExpenseList;
