"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Budget } from "types/budget";
import BudgetChart from "../budgets/BudgetChart";
import Button from "../ui/Button/Button";
import DeleteExpenseForm from "./DeleteExpenseForm";
import EditExpenseForm from "./EditExpenseForm";

interface ExpenseListProps {
  budget?: Budget;
  activeModal: "none" | "create" | "edit" | "delete";
  setActiveModal: (activeModal: "none" | "create" | "edit" | "delete") => void;
}

const ExpenseList = ({
  budget,
  activeModal,
  setActiveModal,
}: ExpenseListProps) => {
  const [sortField, setSortField] = useState<"name" | "amount">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null,
  );

  const selectedExpense = budget?.expenses?.find(
    (expense) => expense.id === selectedExpenseId,
  );

  const toggleSort = (field: "name" | "amount") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (!budget) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>予算データが見つかりません</Typography>
      </Box>
    );
  }

  const expenses = budget.expenses || [];

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

  const handleClickOpenEditForm = (expenseId: string) => {
    setActiveModal("edit");
    setSelectedExpenseId(expenseId);
  };

  const handleClickOpenDeleteForm = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setActiveModal("delete");
  };

  return (
    <>
      <BudgetChart budget={budget} />
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
                    colSpan={2}
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
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() => handleClickOpenEditForm(expense.id)}
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

                        <Button
                          onClick={() => handleClickOpenDeleteForm(expense.id)}
                          startIcon={<DeleteIcon />}
                          color="error"
                          size="small"
                          sx={{
                            minWidth: isMobile ? "40px" : "80px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          削除
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <EditExpenseForm
        open={activeModal}
        setOpen={setActiveModal}
        expense={selectedExpense || ""}
        budgetId={budget.id}
      />
      <DeleteExpenseForm
        open={activeModal}
        setOpen={setActiveModal}
        budgetId={budget.id}
        expenseId={selectedExpense?.id || ""}
        expenseName={selectedExpense?.name || ""}
      />
    </>
  );
};

export default ExpenseList;
