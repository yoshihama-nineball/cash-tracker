"use client";

import EditIcon from "@mui/icons-material/Edit";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Box,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { Budget } from "../../../types/budget";
import Button from "../ui/Button/Button";
import DeleteDialog from "./DeleteDialog";

interface BudgetListProps {
  budgets: Budget[] | { budgets: Budget[] };
}

export default function BudgetList({ budgets }: BudgetListProps) {
  const [sortField, setSortField] = useState<"name" | "amount">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const budgetArray = Array.isArray(budgets)
    ? budgets
    : "budgets" in budgets && Array.isArray(budgets.budgets)
      ? budgets.budgets
      : [];

  const sortedBudgets = [...budgetArray].sort((a, b) => {
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

  if (budgetArray.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          予算がまだ登録されていません
        </Typography>
        <Link href="/admin/budgets/new" passHref>
          <Button variant="primary">最初の予算を作成する</Button>
        </Link>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        boxShadow: 2,
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "primary.light" }}>
          <TableRow>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                width: "25%",
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
                予算名
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                width: "15%",
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
                width: "10%",
              }}
            >
              支出数
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                width: "15%",
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
              colSpan={3}
            >
              アクション
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBudgets.map((budget) => (
            <TableRow
              key={budget._id}
              hover
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:nth-of-type(odd)": { backgroundColor: "#f8f8f8" },
              }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/budgets/${budget._id}`} passHref>
                  <MuiLink
                    sx={{ textDecoration: "none", fontWeight: "medium" }}
                  >
                    {budget.name}
                  </MuiLink>
                </Link>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                ¥{budget.amount.toLocaleString()}
              </TableCell>
              <TableCell>{budget.expenses?.length || 0}</TableCell>
              <TableCell>
                {new Date(budget.createdAt).toLocaleDateString("ja-JP")}
              </TableCell>
              <TableCell align="center" sx={{ p: 1 }}>
                <Link href={`/admin/budgets/${budget._id}/edit`} passHref>
                  <Button
                    startIcon={<EditIcon />}
                    color="primary"
                    size="small"
                    sx={{
                      minWidth: isMobile ? "40px" : "80px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    編集
                  </Button>
                </Link>
              </TableCell>
              <TableCell align="center" sx={{ p: 1 }}>
                <Link href={`/admin/budgets/${budget._id}/expenses`} passHref>
                  <Button
                    startIcon={<ReceiptIcon />}
                    color="secondary"
                    size="small"
                    sx={{
                      minWidth: isMobile ? "40px" : "80px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    支出管理
                  </Button>
                </Link>
              </TableCell>
              <TableCell align="center" sx={{ p: 1 }}>
                <DeleteDialog
                  isMobile={isMobile}
                  budgetId={budget._id}
                  budgetName={budget.name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
