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

export const SuccessSchema = z.string();
export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
// export type SuccessSchemaValues = z.infer<typeof SuccessSchema>
// export type ErrorResponseEchemaValues = z.infer<typeof ErrorResponseSchema>
