"use server";

import { z } from "zod";
import { ErrorResponseSchema, ResetPasswordSchema } from "../libs/schemas/auth";

// APIレスポンス用のスキーマを修正
const ApiSuccessSchema = z
  .object({
    message: z.string().optional(),
    success: z.string().optional(),
  })
  .or(z.string());

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function reset_password(
  prevState: ActionStateType,
  formData: FormData,
) {
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

  const url = `${process.env.API_URL}/auth/reset-password/${token}`;

  try {
    console.log("APIリクエスト送信:", url);

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: resetPasswordData.password,
        password_confirmation: resetPasswordData.password_confirmation,
      }),
    });

    console.log("APIレスポンスステータス:", req.status);
    const json = await req.json();
    console.log("APIレスポンス:", json);

    if (!req.ok) {
      try {
        const { error } = ErrorResponseSchema.parse(json);
        return {
          errors: [error],
          success: "",
        };
      } catch (parseError) {
        return {
          errors: [
            typeof json === "string" ? json : "不明なエラーが発生しました",
          ],
          success: "",
        };
      }
    }

    try {
      const result = ApiSuccessSchema.parse(json);

      let successMessage = "パスワードが正常にリセットされました";

      if (typeof result === "string") {
        successMessage = result;
      } else if (result.success) {
        successMessage = result.success;
      } else if (result.message) {
        successMessage = result.message;
      }

      return {
        errors: [],
        success: successMessage,
      };
    } catch (parseError) {
      console.error("成功レスポンスのパースエラー:", parseError);
      return {
        errors: [],
        success: "パスワードが正常にリセットされました",
      };
    }
  } catch (error) {
    console.error("パスワードリセットエラー:", error);
    return {
      errors: ["サーバーとの通信に失敗しました。後でやり直してください。"],
      success: "",
    };
  }
}
