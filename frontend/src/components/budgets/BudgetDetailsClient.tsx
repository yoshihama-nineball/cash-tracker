// BudgetDetailsClient.tsx (Client Component)
"use client";
import ExpenseList from "@/components/expense/ExpenseList";
import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { Budget } from "../../../libs/schemas/auth";
import CreateExpenseForm from "../expense/CreateExpenseForm";

interface BudgetDetailsClientProps {
  budget: Budget;
}

export default function BudgetDetailsClient({
  budget,
}: BudgetDetailsClientProps) {
  const [activeModal, setActiveModal] = useState<
    "none" | "create" | "edit" | "delete"
  >("none");

  return (
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
        <CreateExpenseForm
          budgetId={budget.id}
          setActiveModal={setActiveModal}
          activeModal={activeModal}
        />
      </Box>
      <ExpenseList
        budget={budget}
        setActiveModal={setActiveModal}
        activeModal={activeModal}
      />
    </Container>
  );
}
