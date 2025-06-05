"use server";

import { ErrorResponseSchema, RegisterSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function register(prevState: ActionStateType, formData: FormData) {
  const registerData = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  // バリデーション
  const register = RegisterSchema.safeParse(registerData);
  if (!register.success) {
    const errors = register.error.errors.map((error) => error.message);
    return {
      errors,
      success: prevState.success,
    };
  }

  // ユーザー登録
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/create-account`;
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: register.data.name,
      password: register.data.password,
      email: register.data.email,
    }),
  });

  const json = await req.json();

  // APIレスポンスの構造をコンソールに出力してデバッグ
  console.log("API Response:", json);

  if (req.status === 409) {
    const { error } = ErrorResponseSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }

  // SuccessSchemaの定義に関わらず、実際のレスポンス構造に基づいて処理
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

  // どのケースにも当てはまらない場合
  return {
    errors: [
      "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
    ],
    success: "",
  };
}
