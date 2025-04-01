"use server";
import {
  ConfirmAccountSchema,
  ErrorResponseSchema,
} from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function confirm_account(
  prevState: ActionStateType,
  formData: FormData,
) {
  //todo: formDataがどこからとっているか確認して学ぶ
  const confirmAccountData = {
    token: formData.get("token"),
  };

  const confirm_account = ConfirmAccountSchema.safeParse(confirmAccountData);
  if (!confirm_account.success) {
    const errors = confirm_account.error.errors.map((error) => error.message);
    return {
      errors,
      success: prevState.success,
    };
  }

  const url = `${process.env.API_URL}/auth/confirm-account`;
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: confirm_account.data.token,
    }),
  });

  const json = await req.json();

  console.log("API Response:", json);

  if (req.status === 409) {
    const { error } = ErrorResponseSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }

  if (typeof json === "string") {
    // レスポンスが文字列の場合
    return {
      errors: [],
      success: json,
    };
  } else if (json && typeof json === "object") {
    // レスポンスがオブジェクトの場合
    if ("success" in json && typeof json.success === "string") {
      // success プロパティが存在し、文字列の場合
      return {
        errors: [],
        success: json.success,
      };
    } else if ("message" in json && typeof json.message === "string") {
      // message プロパティが存在し、文字列の場合
      return {
        errors: [],
        success: json.message,
      };
    }
  }

  return {
    errors: [
      "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
    ],
    success: "",
  };
}
