"use server";

import {
  ErrorResponseSchema,
  ForgotPasswordSchema,
} from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function forget_password(
  prevState: ActionStateType,
  formData: FormData,
) {
  const forgetPasswordData = {
    email: formData.get("email"),
  };

  // 修正: validation結果の正しい処理
  const result = ForgotPasswordSchema.safeParse(forgetPasswordData);

  // 検証に失敗した場合はエラーを返す
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    return {
      errors,
      success: "",
    };
  }

  // ここからは検証成功後の処理
  try {
    const url = `${process.env.API_URL}/auth/forgot-password`;
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: result.data.email, // validationResult.dataを使用
      }),
    });

    const json = await req.json();
    console.log("API response:", json);

    // 409エラー（競合）の処理
    if (req.status === 409) {
      const { error } = ErrorResponseSchema.parse(json);
      return {
        errors: [error],
        success: "",
      };
    }

    // 成功レスポンスの処理
    if (typeof json === "string") {
      return {
        errors: [],
        success: json,
      };
    } else if (json && typeof json === "object") {
      if ("success" in json && typeof json.success === "string") {
        return {
          errors: [],
          success: json.success,
        };
      } else if ("message" in json && typeof json.message === "string") {
        return {
          errors: [],
          success: json.message,
        };
      }
    }

    // 予期しないレスポンス形式の処理
    return {
      errors: [
        "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
      ],
      success: "",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      errors: [
        "パスワードリセット処理中にエラーが発生しました。しばらくしてから再度お試しください。",
      ],
      success: "",
    };
  }
}
