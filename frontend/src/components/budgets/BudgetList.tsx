// components/BudgetList.tsx
"use client";

import EditIcon from "@mui/icons-material/Edit";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Box,
  Button,
  Link as MuiLink,
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
import Link from "next/link";
import { useState } from "react";
import { Budget } from "../../../types/budget";

interface BudgetListProps {
  budgets: Budget[];
}

export default function BudgetList({ budgets }: BudgetListProps) {
  const [sortField, setSortField] = useState<"name" | "amount">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedBudgets = [...budgets].sort((a, b) => {
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

  const toggleSort = (field: "name" | "amount") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (budgets.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          予算がまだ登録されていません
        </Typography>
        <Link href="/budgets/new" passHref>
          <Button variant="contained" color="primary">
            最初の予算を作成する
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, overflow: "hidden" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "grey.100" }}>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === "name"}
                direction={sortField === "name" ? sortDirection : "asc"}
                onClick={() => toggleSort("name")}
              >
                予算名
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "amount"}
                direction={sortField === "amount" ? sortDirection : "asc"}
                onClick={() => toggleSort("amount")}
              >
                金額
              </TableSortLabel>
            </TableCell>
            <TableCell>支出数</TableCell>
            <TableCell>作成日</TableCell>
            <TableCell align="right">アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBudgets.map((budget) => (
            <TableRow
              key={budget._id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/budgets/${budget._id}`} passHref>
                  <MuiLink sx={{ textDecoration: "none" }}>
                    {budget.name}
                  </MuiLink>
                </Link>
              </TableCell>
              <TableCell>¥{budget.amount.toLocaleString()}</TableCell>
              <TableCell>{budget.expenses?.length || 0}</TableCell>
              <TableCell>
                {new Date(budget.createdAt).toLocaleDateString("ja-JP")}
              </TableCell>
              <TableCell align="right">
                <Link href={`/budgets/${budget._id}/edit`} passHref>
                  <Button
                    startIcon={<EditIcon />}
                    color="primary"
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    編集
                  </Button>
                </Link>
                <Link href={`/budgets/${budget._id}/expenses`} passHref>
                  <Button
                    startIcon={<ReceiptIcon />}
                    color="success"
                    size="small"
                  >
                    支出管理
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
