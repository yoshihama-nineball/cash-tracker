import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Budget, Expense } from "../../../libs/schemas/auth";

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetChart;
