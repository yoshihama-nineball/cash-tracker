"use server";

import { revalidatePath } from "next/cache";
import getToken from "../libs/auth/token";
import { UpdatePasswordSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function updatePassword(
  prevState: ActionStateType,
  formData: FormData,
): Promise<ActionStateType> {
  const userPassword = UpdatePasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  if (!userPassword.success) {
    return {
      errors: userPassword.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`;

  try {
    const req = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userPassword.data),
    });

    if (!req.ok) {
      return {
        errors: [`APIエラー: ${req.status} ${req.statusText}`],
        success: "",
      };
    }

    const json = await req.json();

    revalidatePath("/admin");

    if (typeof json === "string") {
      return {
        errors: [],
        success: json,
      };
    } else if (typeof json === "object" && json !== null) {
      if ("success" in json || "message" in json) {
        return {
          errors: [],
          success: json.message || json.success || "パスワードが更新されました",
        };
      }
    }

    return {
      errors: [],
      success: "パスワードが更新されました",
    };
  } catch (error) {
    console.error("Password update error", error);
    return {
      errors: [
        "通信エラーが発生しました。インターネット接続を確認してください。",
      ],
      success: "",
    };
  }
}
