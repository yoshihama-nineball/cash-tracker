"use server";

import {
  ErrorResponseSchema,
  ResetPasswordSchema,
  SuccessSchema,
} from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function reset_password(
  prevState: ActionStateType,
  formData: FormData,
) {
  // トークンをformDataから取得
  const token = formData.get("token");

  if (!token) {
    return {
      errors: ["トークンが見つかりません"],
      success: "",
    };
  }

  const resetPasswordData = {
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const reset_password = ResetPasswordSchema.safeParse(resetPasswordData);

  if (!reset_password.success) {
    const errors = reset_password.error.errors.map((error) => error.message);
    return {
      errors,
      success: prevState.success,
    };
  }

  // トークンを変数から使用
  const url = `${process.env.API_URL}/auth/reset-password/${token}`;

  try {
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: resetPasswordData.password,
      }),
    });

    const json = await req.json();

    if (!req.ok) {
      const { error } = ErrorResponseSchema.parse(json);
      return {
        errors: [error],
        success: "",
      };
    }

    const success = SuccessSchema.parse(json);
    return {
      errors: [],
      success,
    };
  } catch (error) {
    console.error("パスワードリセットエラー:", error);
    return {
      errors: ["サーバーとの通信に失敗しました。後でやり直してください。"],
      success: "",
    };
  }
}
