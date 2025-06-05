import { render, screen } from "@testing-library/react";
import ProfileTabs from "./ProfileTabs";

jest.mock("./ProfileForm", () => {
  const MockProfileForm = ({ profile }) => (
    <div data-testid="profile-form">Profile Form for {profile.name}</div>
  );
  MockProfileForm.displayName = "MockProfileForm";
  return MockProfileForm;
});

jest.mock("@mui/material", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Tabs: ({ children }) => <div role="tablist">{children}</div>,
  Tab: ({ label }) => <button role="tab">{label}</button>,
  Typography: ({ children, variant }) => {
    if (variant === "h4") return <h4>{children}</h4>;
    return <div>{children}</div>;
  },
}));

jest.mock("@mui/material/Box", () => {
  const MockBox = ({ children }) => <div>{children}</div>;
  MockBox.displayName = "MockBox";
  return MockBox;
});

jest.mock("@mui/material/Tab", () => {
  const MockTab = ({ label }) => <button role="tab">{label}</button>;
  MockTab.displayName = "MockTab";
  return MockTab;
});

jest.mock("@mui/material/Tabs", () => {
  const MockTabs = ({ children }) => <div role="tablist">{children}</div>;
  MockTabs.displayName = "MockTabs";
  return MockTabs;
});

jest.mock("@mui/material/Typography", () => {
  const MockTypography = ({ children, variant }) => {
    if (variant === "h4") return <h4>{children}</h4>;
    return <div>{children}</div>;
  };
  MockTypography.displayName = "MockTypography";
  return MockTypography;
});

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useState: jest.fn(() => [0, jest.fn()]),
  };
});

describe("ProfileTabsコンポーネントのテスト", () => {
  const mockProfile = {
    id: "12345",
    _id: "12345",
    name: "Test User",
    email: "test@example.com",
  };

  const defaultProps = {
    profile: mockProfile,
  };

  it("フォームが正しくレンダリングされること", () => {
    render(<ProfileTabs {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
      "ユーザ情報",
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent("ユーザ設定");
    expect(tabs[1]).toHaveTextContent("パスワード設定");

    expect(screen.getByTestId("profile-form")).toBeInTheDocument();
    expect(screen.getByTestId("profile-form")).toHaveTextContent(
      "Profile Form for Test User",
    );
  });
});
