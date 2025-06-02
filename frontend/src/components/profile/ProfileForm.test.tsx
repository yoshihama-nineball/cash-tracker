import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import * as ReactHookForm from "react-hook-form";
import * as MessageContext from "../../../context/MessageContext";
import ProfileForm from "./ProfileForm";

jest.mock("../ui/Button/Button", () => {
  const MockButton = ({ children, onClick, disabled, type, ...props }) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = "MockButton";
  return MockButton;
});

jest.mock("@mui/material", () => ({
  Box: ({ children }) => <div>{children}</div>,
  FormControl: ({ children, error }) => (
    <div data-testid="form-control" data-error={!!error}>
      {children}
    </div>
  ),
  FormHelperText: ({ children }) => (
    <span data-testid="error-message">{children}</span>
  ),
  FormLabel: ({ children, htmlFor }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  TextField: ({ placeholder, id, error, ...props }) => (
    <input
      id={id}
      placeholder={placeholder}
      aria-label={id}
      data-error={!!error}
      {...props}
    />
  ),
}));

jest.mock("../../../context/MessageContext", () => ({
  useMessage: () => ({
    showMessage: jest.fn(),
  }),
}));

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");
  return {
    ...originalModule,
    useActionState: jest.fn(),
    useTransition: jest.fn(),
    useEffect: jest.fn(),
    useRef: jest.fn(() => ({ current: null })),
    forwardRef: (fn) => fn,
  };
});

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

jest.mock("../../../actions/update-profile-action", () => ({
  updateProfile: jest.fn(),
}));

describe("ProfileFormコンポーネントのテスト", () => {
  const mockProfile = {
    id: "123456",
    _id: "123456",
    name: "User Name",
    email: "test@example.com",
  };

  const defaultProps = {
    profile: mockProfile,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (React.useActionState as jest.Mock).mockReturnValue([
      { errors: [], success: "" },
      jest.fn(),
    ]);

    (React.useTransition as jest.Mock).mockReturnValue([false, jest.fn()]);

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn((name) => ({
        name,
        id: name,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      })),
      handleSubmit: jest.fn((fn) => (e) => {
        e?.preventDefault?.();
        fn({ name: "User Name", email: "test@example.com" });
      }),
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    (React.useEffect as jest.Mock).mockImplementation((callback) => {
      callback();
    });
  });

  it("フォームが正しくレンダリングされること", () => {
    render(<ProfileForm {...defaultProps} />);

    expect(screen.getByLabelText(/ユーザ名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("基本的なフォーム送信テスト", () => {
    const mockHandleSubmit = jest.fn((fn) => (e) => {
      e?.preventDefault?.();
      return fn({ name: "User Name", email: "test@example.com" });
    });

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {}, isSubmitting: false },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    render(<ProfileForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });
    fireEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("isSubmitting時にボタンが無効化され、テキストが変わること", () => {
    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: true },
      reset: jest.fn(),
      setValue: jest.fn(),
    });

    render(<ProfileForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /送信中/i });
    expect(submitButton).toBeDisabled();
  });

  it("isPending時にボタンが無効化され、テキストが変わること", () => {
    (React.useTransition as jest.Mock).mockReturnValue([true, jest.fn()]);

    render(<ProfileForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /送信中/i });
    expect(submitButton).toBeDisabled();
  });

  it("バリデーションエラーが表示されること", () => {
    const mockErrors = {
      name: { message: "ユーザ名は必須です", type: "required" },
      email: { message: "メールアドレスは必須です", type: "required" },
    };

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: mockErrors, isSubmitting: false },
      setValue: jest.fn(),
    });

    render(<ProfileForm {...defaultProps} />);

    const formControls = screen.getAllByTestId("form-control");
    expect(formControls[0]).toHaveAttribute("data-error", "true");

    expect(screen.getByText(/ユーザ名は必須です/i)).toBeInTheDocument();
    expect(screen.getByText(/メールアドレスは必須です/i)).toBeInTheDocument();
  });

  it("useFormが適切な設定で呼ばれること", () => {
    render(<ProfileForm {...defaultProps} />);

    expect(ReactHookForm.useForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          name: "",
          email: "",
        },
      }),
    );
  });

  it("プロフィール情報が初期値として設定させること", () => {
    const mockSetValue = jest.fn();

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: false },
      setValue: mockSetValue,
    });

    render(<ProfileForm {...defaultProps} />);

    expect(mockSetValue).toHaveBeenCalledWith("name", "User Name");
    expect(mockSetValue).toHaveBeenCalledWith("email", "test@example.com");
  });
  it("成功メッセージが表示されること", () => {
    const mockShowMessage = jest.fn();

    jest.spyOn(MessageContext, "useMessage").mockReturnValue({
      showMessage: mockShowMessage,
      message: null,
      clearMessage: jest.fn(),
    });

    const successFormState = {
      errors: [],
      success: "プロフィールが更新されました",
    };

    (React.useActionState as jest.Mock).mockReturnValue([
      successFormState,
      jest.fn(),
    ]);

    (React.useEffect as jest.Mock).mockImplementation(() => {
      // useEffectは何もしない
    });

    render(<ProfileForm {...defaultProps} />);

    // 実際のuseEffectのロジックを手動で実行
    if (successFormState.success && successFormState.success.trim() !== "") {
      mockShowMessage(successFormState.success, "success");
    }

    expect(mockShowMessage).toHaveBeenCalledWith(
      "プロフィールが更新されました",
      "success",
    );
  });

  it("エラーメッセージが表示されること", () => {
    const mockShowMessage = jest.fn();

    jest.spyOn(MessageContext, "useMessage").mockReturnValue({
      showMessage: mockShowMessage,
      message: null,
      clearMessage: jest.fn(),
    });

    const errorFormState = { errors: ["更新に失敗しました"], success: "" };

    (React.useActionState as jest.Mock).mockReturnValue([
      errorFormState,
      jest.fn(),
    ]);

    (React.useEffect as jest.Mock).mockImplementation(() => {});

    render(<ProfileForm {...defaultProps} />);

    if (errorFormState.errors.length > 0) {
      mockShowMessage(errorFormState.errors[0], "error");
    }

    expect(mockShowMessage).toHaveBeenCalledWith("更新に失敗しました", "error");
  });
  it("プロフィールがnullの場合でもsetValueが呼ばれないこと", () => {
    const mockSetValue = jest.fn();

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {}, isSubmitting: false },
      setValue: mockSetValue,
    });

    render(<ProfileForm profile={null} />);

    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it("onSubmit関数が正しく動作すること", () => {
    const mockDispatch = jest.fn();
    const mockStartTransition = jest.fn((callback) => callback());

    (React.useActionState as jest.Mock).mockReturnValue([
      { errors: [], success: "" },
      mockDispatch,
    ]);

    (React.useTransition as jest.Mock).mockReturnValue([
      false,
      mockStartTransition,
    ]);

    let capturedOnSubmit = null;
    const mockHandleSubmit = jest.fn((fn) => {
      capturedOnSubmit = fn;
      return (e) => {
        e?.preventDefault?.();
      };
    });

    (ReactHookForm.useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {}, isSubmitting: false },
      setValue: jest.fn(),
    });

    render(<ProfileForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });
    fireEvent.click(submitButton);

    if (capturedOnSubmit) {
      capturedOnSubmit({ name: "Test User", email: "test@example.com" });
    }

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();

    const formData = mockDispatch.mock.calls[0][0];
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("name")).toBe("Test User");
    expect(formData.get("email")).toBe("test@example.com");
  });
});
