import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "メールアドレスは必須です")
      .email("有効なメールアドレスを入力してください"),
    name: z
      .string()
      .min(1, "ユーザー名は必須です")
      .max(50, "ユーザー名は50文字以内で入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります",
      ),
    password_confirmation: z.string().min(1, "パスワード(確認)は必須です"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードが一致しません",
    path: ["password_confirmation"],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
});

export const ConfirmAccountSchema = z.object({
  token: z
    .string()
    .min(1, "認証コードは必須です")
    .length(6, "トークンが無効です")
    .regex(/^\d+$/, "認証コードは数字のみで入力してください"),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
});

export const ValidateTokenSchema = z.object({
  token: z
    .string()
    .min(1, "認証コードは必須です")
    .length(6, "トークンが無効です"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "パスワードは8文字以上です" }),
    password_confirmation: z.string().min(1, "パスワード(確認)は必須です"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードが一致しません",
    path: ["password_confirmation"],
  });

export const DraftBudgetSchema = z.object({
  name: z.string().min(1, { message: "予算タイトルは必須です" }),
  amount: z.coerce
    .number({ message: "予算金額の値が無効です" })
    .min(1, { message: "予算金額が0円未満です" }),
});

export const DraftExpenseSchema = z.object({
  name: z.string().min(1, { message: "支出タイトルは必須です" }),
  amount: z.coerce
    .number({ message: "支出金額の値が無効です" })
    .min(1, { message: "支出金額が0円未満です" }),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, { message: "ユーザ名は必須です" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
});

export const UpdatePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "現在のパスワードは必須です" })
      .min(8, { message: "現在のパスワードは8文字以上です" }),
    password: z
      .string()
      .min(1, { message: "再設定するパスワードは必須です" })
      .min(8, { message: "再設定するパスワードは8文字以上です" }),
    password_confirmation: z
      .string()
      .min(1, { message: "パスワード確認は必須です" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードが一致しません",
    path: ["password_confirmation"],
  });

export const SuccessSchema = z.string();
export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const ExpenseAPIResponseSchema = z.object({
  _id: z.string(),
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? val : String(val))),

  name: z.string(),

  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val) : val)),

  budgetId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? val : String(val))),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BudgetAPIResponseSchema = z.object({
  _id: z.string(),
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? val : String(val))),

  name: z.string(),

  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? Number(val) : val)),

  userId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? val : String(val))),

  createdAt: z.string(),
  updatedAt: z.string(),

  expenses: z.array(ExpenseAPIResponseSchema).optional(),

  user: z.union([
    z.string(),
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      _id: z.string(),
    })
  ]).optional(),
});

export const BudgetsAPIResponseSchema = z.object({
  budgets: z.array(BudgetAPIResponseSchema.omit({ expenses: true })),
});

export type Budget = z.infer<typeof BudgetAPIResponseSchema>;
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>;
export type User = z.infer<typeof UserSchema>;

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type ConfirmAccountFormValues = z.infer<typeof ConfirmAccountSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type SuccessSchemaValues = z.infer<typeof SuccessSchema>;
export type ErrorResponseEchemaValues = z.infer<typeof ErrorResponseSchema>;
export type UserSchemaFormValues = z.infer<typeof UserSchema>;
export type ValidateTokenFormValues = z.infer<typeof ValidateTokenSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
export type DraftBudgetFormValues = z.infer<typeof DraftBudgetSchema>;
export type DraftExpenseFormValues = z.infer<typeof DraftExpenseSchema>;
export type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordSchema>;
