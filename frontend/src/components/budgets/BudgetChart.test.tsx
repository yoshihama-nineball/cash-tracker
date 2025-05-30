import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { Budget, Expense } from "../../../libs/schemas/auth";
import BudgetChart from "./BudgetChart";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

jest.mock("recharts", () => ({
  ...jest.requireActual("recharts"),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    data,
    label,
  }: {
    data: ChartData[];
    label: (entry: ChartData) => string;
  }) => (
    <div data-testid="pie" data-pie-data={JSON.stringify(data)}>
      {data.map((entry, index) => (
        <div key={index} data-testid={`pie-cell-${index}`}>
          {label && label(entry)}
        </div>
      ))}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="pie-cell" style={{ backgroundColor: fill }} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe("BudgetChart", () => {
  const mockExpenses: Expense[] = [
    {
      id: "1",
      amount: 30000,
      description: "食費",
      date: new Date("2024-01-15"),
      category: "food",
      budgetId: "budget1",
    },
    {
      id: "2",
      amount: 20000,
      description: "交通費",
      date: new Date("2024-01-20"),
      category: "transport",
      budgetId: "budget1",
    },
  ];

  const mockBudgetWithinLimit: Budget = {
    id: "budget1",
    name: "月間予算",
    amount: 100000,
    category: "monthly",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    expenses: mockExpenses,
    userId: "user1",
  };

  const mockBudgetOverLimit: Budget = {
    id: "budget2",
    name: "週間予算",
    amount: 40000,
    category: "weekly",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-07"),
    expenses: mockExpenses,
    userId: "user1",
  };

  const mockBudgetNoExpenses: Budget = {
    id: "budget3",
    name: "予算のみ",
    amount: 50000,
    category: "other",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    expenses: [],
    userId: "user1",
  };

  describe("基本的な表示", () => {
    test("予算内の場合、正しい情報が表示される", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetWithinLimit} />);

      expect(screen.getByText("総予算")).toBeInTheDocument();
      expect(screen.getByText("¥100,000")).toBeInTheDocument();

      expect(screen.getByText("使用済み")).toBeInTheDocument();

      const amounts = screen.getAllByText("¥50,000");
      expect(amounts).toHaveLength(2);
      expect(screen.getByText("残高")).toBeInTheDocument();
      expect(screen.getByText("支出件数: 2件")).toBeInTheDocument();
      expect(screen.getByText("平均支出: ¥25,000")).toBeInTheDocument();
    });

    test("予算超過の場合、警告表示される", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetOverLimit} />);

      expect(screen.getByText("予算超過")).toBeInTheDocument();
      expect(screen.getByText("¥10,000")).toBeInTheDocument();
      expect(screen.queryByText("残高")).not.toBeInTheDocument();
      expect(screen.getByText("使用率: 125%")).toBeInTheDocument();
    });

    test("支出がない場合、適切に表示される", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetNoExpenses} />);

      expect(screen.getByText("¥0")).toBeInTheDocument();

      const amounts = screen.getAllByText("¥50,000");
      expect(amounts.length).toBeGreaterThanOrEqual(1);

      expect(screen.getByText("支出件数: 0件")).toBeInTheDocument();
      expect(screen.queryByText(/平均支出/)).not.toBeInTheDocument();
      expect(screen.getByText("使用率: 0%")).toBeInTheDocument();
    });
  });

  describe("円グラフのデータ", () => {
    test("予算内の場合、正しいデータが渡される", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetWithinLimit} />);

      const pieElement = screen.getByTestId("pie");
      const pieDataString = pieElement.getAttribute("data-pie-data");
      const pieData: ChartData[] = JSON.parse(pieDataString || "[]");

      expect(pieData).toHaveLength(2);
      expect(
        pieData.find((item: ChartData) => item.name === "使用済み"),
      ).toEqual({
        name: "使用済み",
        value: 50000,
        color: "#4caf50",
      });
      expect(pieData.find((item: ChartData) => item.name === "残り")).toEqual({
        name: "残り",
        value: 50000,
        color: "#e0e0e0",
      });
    });

    test("予算超過の場合、超過データが含まれる", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetOverLimit} />);

      const pieElement = screen.getByTestId("pie");
      const pieDataString = pieElement.getAttribute("data-pie-data");
      const pieData: ChartData[] = JSON.parse(pieDataString || "[]");

      expect(pieData).toHaveLength(2);
      expect(
        pieData.find((item: ChartData) => item.name === "使用済み"),
      ).toEqual({
        name: "使用済み",
        value: 40000,
        color: "#4caf50",
      });
      expect(pieData.find((item: ChartData) => item.name === "超過")).toEqual({
        name: "超過",
        value: 10000,
        color: "#f44336",
      });
    });
  });

  describe("使用率チップの色", () => {
    test("使用率0-80%: success色", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetWithinLimit} />);
      const chip = screen.getByText("使用率: 50%").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorSuccess");
    });

    test("使用率81-100%: warning色", () => {
      const highUsageBudget: Budget = {
        ...mockBudgetWithinLimit,
        amount: 55000,
      };
      renderWithTheme(<BudgetChart budget={highUsageBudget} />);
      const chip = screen.getByText("使用率: 91%").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorWarning");
    });

    test("使用率100%超: error色と警告アイコン", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetOverLimit} />);
      const chip = screen.getByText("使用率: 125%").closest(".MuiChip-root");
      expect(chip).toHaveClass("MuiChip-colorError");
      expect(
        chip?.querySelector('[data-testid="WarningIcon"]'),
      ).toBeInTheDocument();
    });
  });

  describe("エッジケース", () => {
    test("expensesがundefinedの場合", () => {
      const budgetWithoutExpenses: Budget = {
        ...mockBudgetNoExpenses,
        expenses: undefined,
      };

      expect(() => {
        renderWithTheme(<BudgetChart budget={budgetWithoutExpenses} />);
      }).not.toThrow();

      expect(screen.getByText("支出件数: 0件")).toBeInTheDocument();
      expect(screen.getByText("使用率: 0%")).toBeInTheDocument();
    });

    test("予算額が0の場合", () => {
      const zeroBudget: Budget = {
        ...mockBudgetNoExpenses,
        amount: 0,
      };

      expect(() => {
        renderWithTheme(<BudgetChart budget={zeroBudget} />);
      }).not.toThrow();

      const zeroAmounts = screen.getAllByText("¥0");
      expect(zeroAmounts.length).toBeGreaterThanOrEqual(2);
    });

    test("非常に大きな数値の場合、適切にフォーマットされる", () => {
      const largeBudget: Budget = {
        ...mockBudgetWithinLimit,
        amount: 1000000,
        expenses: [
          {
            id: "1",
            amount: 500000,
            description: "大きな支出",
            date: new Date(),
            category: "other",
            budgetId: "budget1",
          },
        ],
      };

      renderWithTheme(<BudgetChart budget={largeBudget} />);
      expect(screen.getByText("¥1,000,000")).toBeInTheDocument();

      const amounts = screen.getAllByText("¥500,000");
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("コンポーネント構造", () => {
    test("グラフコンポーネントが正しくレンダリングされる", () => {
      renderWithTheme(<BudgetChart budget={mockBudgetWithinLimit} />);

      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
      expect(screen.getByTestId("pie")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("legend")).toBeInTheDocument();
    });

    test("Paperコンポーネントが存在する", () => {
      const { container } = renderWithTheme(
        <BudgetChart budget={mockBudgetWithinLimit} />,
      );
      const paper = container.querySelector(".MuiPaper-root");
      expect(paper).toBeInTheDocument();
    });
  });
});
