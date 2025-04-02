import { logout } from "./logout-user-action";

// next/headersのモック
jest.mock("next/headers", () => {
  const mockCookieStore = {
    delete: jest.fn(),
  };
  return {
    cookies: jest.fn(() => mockCookieStore),
  };
});

jest.mock("next/navigation", () => {
  return {
    redirect: jest.fn(),
  };
});

describe("logout関数", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cookieを削除し、ログイン画面にリダイレクトする", async () => {
    // logout関数を実行
    await logout();

    // cookieが削除されることを確認
    const cookieStore = require("next/headers").cookies();
    expect(cookieStore.delete).toHaveBeenCalledWith("CASHTRACKR_TOKEN");

    // ログイン画面にリダイレクトすることを確認
    const { redirect } = require("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/auth/login");
  });
});
