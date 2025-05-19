import { render, screen } from "@testing-library/react";
import EditBudgetForm from "./EditBudgetForm";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockHandleSubmit = jest.fn((cb) => (e) => {
  e?.preventDefault?.();
  cb({ name: "Test Budget", amount: 10000 });
  return true;
});

jest.mock("react-hook-form", () => {
  return {
    useForm: () => ({
      register: jest.fn((name) => ({ name })),
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: false,
      },
      reset: jest.fn(),
      setValue: jest.fn(),
    }),
  };
});

jest.mock("../../../actions/update-budget-action.ts", () => ({
  updateBudget: jest.fn(() =>
    Promise.resolve({ errors: [], success: "Success" }),
  ),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(() => [{ errors: [], success: "" }, jest.fn()]),
    useTransition: jest.fn(() => [false, jest.fn()]),
  };
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

describe("EditBudgetFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされること", () => {
    render(<EditBudgetForm />);

    expect(screen.getByText(/予算の編集/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });
});
