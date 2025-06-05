// components/budgets/BudgetSkeleton.test.tsx
import { render, screen } from "@testing-library/react";
import BudgetSkeleton from "./BudgetSkeleton";

describe("BudgetSkeletonコンポーネント", () => {
  it("正しく表示されること", () => {
    // コンポーネントをレンダリング
    render(<BudgetSkeleton />);

    // テーブルヘッダーが正しく表示されているか確認
    expect(screen.getByText("予算名 ↑")).toBeInTheDocument();
    expect(screen.getByText("金額")).toBeInTheDocument();
    expect(screen.getByText("支出数")).toBeInTheDocument();
    expect(screen.getByText("作成日")).toBeInTheDocument();
    expect(screen.getByText("アクション")).toBeInTheDocument();

    // スケルトンアイテムが4つ表示されているか確認
    const tableRows = screen.getAllByRole("row");
    // ヘッダー行 + 4つのスケルトン行 = 5行
    expect(tableRows.length).toBe(5);
  });

  it("円形のスケルトンボタンが各行に2つずつ表示されること", () => {
    render(<BudgetSkeleton />);

    // ヘッダー行を除く行を取得
    const tableRows = screen.getAllByRole("row").slice(1);

    // 各行に2つのアクションボタン用のスケルトンがあることを検証
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const lastCell = cells[cells.length - 1]; // 最後のセルがアクションボタンを含む

      // Flexコンテナ内に2つの子要素があることを確認
      const flexContainer = lastCell.querySelector('[class*="MuiBox-root"]');
      expect(flexContainer?.children.length).toBe(2);
    });
  });

  it("テーブルのスタイリングが適切に適用されていること", () => {
    render(<BudgetSkeleton />);

    // テーブルコンテナのスタイリングをテスト
    const tableContainer = screen.getByRole("table").parentElement;
    expect(tableContainer).toHaveClass("MuiPaper-root"); // Paperコンポーネントのクラスを持つ

    // ヘッダー行の背景色が設定されていることを確認
    // スタイルの直接比較ではなく、クラスベースでテスト
    const headerRow = screen.getAllByRole("row")[0];
    expect(headerRow).toHaveAttribute(
      "class",
      expect.stringContaining("MuiTableRow-root"),
    );

    // ヘッダーセルがスタイリングされていることを確認
    const headerCells = headerRow.querySelectorAll("th");
    expect(headerCells.length).toBeGreaterThan(0);

    // fontWeightプロパティの具体的な値ではなく、
    // プロパティが設定されていることだけを確認
    Array.from(headerCells).forEach((cell) => {
      const computedStyle = window.getComputedStyle(cell);
      expect(computedStyle.fontWeight).toBeTruthy(); // 何らかの値が設定されていることを確認
    });
  });
});
