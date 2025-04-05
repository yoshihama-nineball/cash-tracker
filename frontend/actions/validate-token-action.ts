"use server";

import { ErrorResponseSchema, ValidateTokenSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function validate_token(
  prevState: ActionStateType,
  formData: FormData,
) {
  const validateTokenData = {
    token: formData.get("token"),
  };

  const validate_token = ValidateTokenSchema.safeParse(validateTokenData);
  if (!validate_token.success) {
    const errors = validate_token.error.errors.map((error) => error.message);
    return {
      errors,
      success: prevState.success,
    };
  }

  const url = `${process.env.API_URL}/auth/validate-token`;
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: validate_token.data.token,
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

  return {
    errors: [
      "レスポンス形式が予期しないものでした。管理者にお問い合わせください。",
    ],
    success: "",
  };
}
