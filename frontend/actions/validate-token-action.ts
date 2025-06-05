"use server";

import { ValidateTokenSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function validate_token(
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log("サーバーアクション実行", {
    token: formData.get("token"),
    prevState,
  });

  try {
    const validateTokenData = {
      token: formData.get("token"),
    };

    // トークンのバリデーション
    const validate_token = ValidateTokenSchema.safeParse(validateTokenData);
    if (!validate_token.success) {
      const errors = validate_token.error.errors.map((error) => error.message);
      console.log("バリデーションエラー:", errors);
      return {
        errors,
        success: prevState.success,
      };
    }

    // API呼び出し
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`;
      console.log("API呼び出し:", url);

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: validate_token.data.token,
        }),
      });

      console.log("APIレスポンスステータス:", req.status);
      const json = await req.json();
      console.log("APIレスポンス:", json);

      if (req.status === 409) {
        return {
          errors: [json.error || "トークンが無効です"],
          success: "",
        };
      }

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
        }
      }

      // APIリクエストが失敗した場合
      return {
        errors: [
          "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
        ],
        success: "",
      };
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      return {
        errors: ["サーバーとの通信に失敗しました。後でやり直してください。"],
        success: "",
      };
    }
  } catch (error) {
    console.error("予期しないエラー:", error);
    return {
      errors: ["予期しないエラーが発生しました。"],
      success: "",
    };
  }
}
