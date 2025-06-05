"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorResponseSchema, LoginSchema } from "../libs/schemas/auth";

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function authenticate(
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log("🔍 認証開始");
  
  const loginCredentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log("📧 Email:", loginCredentials.email);
  console.log("🔑 Password exists:", !!loginCredentials.password);

  const auth = LoginSchema.safeParse(loginCredentials);
  if (!auth.success) {
    console.log("❌ バリデーションエラー:", auth.error.errors);
    return {
      errors: auth.error.errors.map((issue) => issue.message),
      success: "",
    };
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  console.log("🌐 リクエストURL:", url);

  try {
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: auth.data.password,
        email: auth.data.email,
      }),
    });

    console.log("📡 レスポンスステータス:", req.status);
    console.log("📡 レスポンスOK:", req.ok);

    const json = await req.json();
    console.log("📄 レスポンス内容:", json);

    if (!req.ok) {
      console.log("❌ APIエラー");
      const { error } = ErrorResponseSchema.parse(json);
      return {
        errors: [error],
        success: "",
      };
    }

    console.log("✅ ログイン成功、Cookieを設定中");
    console.log("🍪 JWTトークン長さ:", typeof json === 'string' ? json.length : 'Not a string');

    const cookieStore = await cookies();
    cookieStore.set({
      name: "CASHTRACKR_TOKEN",
      value: json,
      httpOnly: true,
      path: "/",
    });

    console.log("🍪 Cookie設定完了、リダイレクト開始");
    redirect("/admin/budgets");
    
  } catch (error) {
    console.error("🚨 予期しないエラー:", error);
    // TypeScriptエラーを修正
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    return {
      errors: ["ネットワークエラーが発生しました: " + errorMessage],
      success: "",
    };
  }
}