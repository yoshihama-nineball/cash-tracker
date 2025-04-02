import { render } from "@testing-library/react";
import ForgotPassword from "./ForgotPasswordForm";

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({}))
}))

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return fn({ email: "test@example.com" })
    }),
    formState: {
      errors: {},
      isSubmitting: false
    },
    reset: jest.fn()
  })
}))

describe("ForgetPasswordFormコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("パスワード再設定用のメアド送信フォームが正しくレンダリングされるかのテストケース", () => {
    render(<ForgotPassword />)

    expect(screen.getByLabelText())
  })
})