import { Warning } from "@mui/icons-material";
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Budget, Expense } from "../../../libs/schemas/auth";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const BudgetChart = ({ budget }: { budget: Budget }) => {
  const totalSpent =
    budget.expenses?.reduce(
      (sum: number, expense: Expense) => sum + expense.amount,
      0,
    ) || 0;
  const remaining = Math.max(0, budget.amount - totalSpent);
  const overspent = Math.max(0, totalSpent - budget.amount);

  const data = [
    {
      name: "使用済み",
      value: Math.min(totalSpent, budget.amount),
      color: "#4caf50",
    },
    { name: "超過", value: overspent, color: "#f44336" },
    { name: "残り", value: remaining, color: "#e0e0e0" },
  ].filter((item) => item.value > 0);

  const usagePercentage = Math.round((totalSpent / budget.amount) * 100);

  const renderCustomLabel = (entry: ChartData) => {
    const percent = ((entry.value / budget.amount) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, mt: 1 }}>
      <Grid container spacing={1} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `¥${Number(value).toLocaleString()}`,
                      "",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Chip
                label={`使用率: ${usagePercentage}%`}
                color={
                  overspent > 0
                    ? "error"
                    : usagePercentage > 80
                      ? "warning"
                      : "success"
                }
                size="small"
                icon={overspent > 0 ? <Warning fontSize="small" /> : undefined}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    総予算
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ fontSize: "1.1rem" }}
                  >
                    ¥{budget.amount.toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    使用済み
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="h6"
                    color={overspent > 0 ? "error.main" : "success.main"}
                    sx={{ fontSize: "1.1rem" }}
                  >
                    ¥{totalSpent.toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>
            {overspent > 0 ? (
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      予算超過
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="h6"
                      color="error.main"
                      sx={{ fontSize: "1.1rem" }}
                    >
                      ¥{overspent.toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      残高
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="h6"
                      color="success.main"
                      sx={{ fontSize: "1.1rem" }}
                    >
                      ¥{remaining.toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>

          <Box sx={{ mt: 1, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              支出件数: {budget.expenses?.length || 0}件
            </Typography>
            {budget.expenses && budget.expenses.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                平均支出: ¥
                {Math.round(
                  totalSpent / budget.expenses.length,
                ).toLocaleString()}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BudgetChart;
