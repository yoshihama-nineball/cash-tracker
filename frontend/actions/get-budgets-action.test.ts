// app/actions/get-budgets-action.test.ts
import getToken from "../libs/auth/token";
import { getUserBudgets } from "./get-budgets-action";

// getToken関数をモック
jest.mock("../libs/auth/token", () => {
  return jest.fn().mockResolvedValue("mock-token");
});

// グローバルfetch関数をモック
global.fetch = jest.fn();

// 環境変数の設定
process.env.API_URL = "https://api.example.com";

describe("getUserBudgets", () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常にデータを取得できる場合、整形された予算データを返す", async () => {
    // 配列の形式でAPIが返すケース
    const mockBudgetsArray = [
      { id: 1, name: "食費", amount: 30000 },
      { id: 2, name: "家賃", amount: 80000 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockBudgetsArray),
    });

    const result = await getUserBudgets();

    // 期待される結果
    expect(result).toEqual({ budgets: mockBudgetsArray });

    // fetch関数が正しいURLと認証ヘッダーで呼ばれたか確認
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/budgets",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer mock-token",
        },
        next: {
          tags: ["all-budgets"],
        },
      }),
    );

    // getToken関数が呼ばれたか確認
    expect(getToken).toHaveBeenCalled();
  });

  it("APIがbudgetsプロパティを持つオブジェクトを返す場合、そのまま返す", async () => {
    // budgetsプロパティを持つオブジェクトをAPIが返すケース
    const mockBudgetsObject = {
      budgets: [
        { id: 1, name: "食費", amount: 30000 },
        { id: 2, name: "家賃", amount: 80000 },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockBudgetsObject),
    });

    const result = await getUserBudgets();

    // 期待される結果
    expect(result).toEqual(mockBudgetsObject);
  });

  it("APIが単一オブジェクトを返す場合、budgetsプロパティの配列に変換する", async () => {
    // 単一オブジェクトをAPIが返すケース
    const mockSingleBudget = { id: 1, name: "食費", amount: 30000 };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockSingleBudget),
    });

    const result = await getUserBudgets();

    // 期待される結果
    expect(result).toEqual({ budgets: [mockSingleBudget] });
  });

  it("APIエラーの場合、空の予算リストを返す", async () => {
    // APIエラーのシミュレーション
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // コンソールエラーをスパイ
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await getUserBudgets();

    // エラー時は空の予算リストを返す
    expect(result).toEqual({ budgets: [] });

    // エラーログが出力されたか確認
    expect(consoleSpy).toHaveBeenCalled();

    // スパイを元に戻す
    consoleSpy.mockRestore();
  });

  it("fetchリクエストが失敗した場合、空の予算リストを返す", async () => {
    // fetch自体が失敗するケース
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await getUserBudgets();

    expect(result).toEqual({ budgets: [] });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("getTokenが失敗した場合、空の予算リストを返す", async () => {
    // getTokenが失敗するケース
    (getToken as jest.Mock).mockRejectedValueOnce(new Error("Token error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await getUserBudgets();

    expect(result).toEqual({ budgets: [] });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
