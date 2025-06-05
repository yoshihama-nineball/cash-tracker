import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: ActionStateType,
  formData: FormData,
) {
  const loginCredentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const auth = LoginSchema.safeParse(loginCredentials);
  if (!auth.success) {
    return {
      errors: auth.error.errors.map((issue) => issue.message),
      success: "",
    };
  }

  // 環境変数を使用（パスを正しく結合）
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  
  console.log('Request URL:', url); // デバッグ用

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

    // レスポンスをデバッグ
    console.log('Response status:', req.status);
    
    const json = await req.json();

    if (!req.ok) {
      const { error } = ErrorResponseSchema.parse(json);
      return {
        errors: [error],
        success: "",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "CASHTRACKR_TOKEN",
      value: json,
      httpOnly: true,
      path: "/",
    });

    redirect("/admin/budgets");
  } catch (error) {
    console.error('Network error:', error);
    return {
      errors: ["サーバーエラーが発生しました"],
      success: "",
    };
  }
}