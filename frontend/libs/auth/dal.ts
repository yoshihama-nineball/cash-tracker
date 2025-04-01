"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { UserSchema } from "../schemas/auth";

export const verifySession = cache(async () => {
  try {

    // セッションチェック
    const cookieStore = cookies();
    const token = cookieStore.get("CASHTRACKR_TOKEN");

    if (!token) {
      // この部分が原因で無限リダイレクトが発生している可能性がある
      // 一時的にコメントアウトして動作確認
      // redirect("/auth/login");
      return { user: null, isAuth: false };
    }

    const jwtToken = token.value;
    const url = `${process.env.API_URL}/auth/user`;
    const req = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!req.ok) {
      const errorData = await req.json();
      console.error("APIエラー:", errorData);

      if (req.status === 401 || req.status === 403) {
        // ここも一時的にコメントアウト
        // redirect("/auth/login");
        return { user: null, isAuth: false };
      }
      return { user: null, isAuth: false };
    }

    const session = await req.json();
    const result = UserSchema.safeParse(session);

    if (!result.success) {
      // ここも一時的にコメントアウト
      // redirect("/auth/login");
      return { user: null, isAuth: false };
    }

    return {
      user: result.data,
      isAuth: true,
    };
  } catch (error) {
    console.error("セッション検証エラー:", error);
    // エラー時もリダイレクトせず、未認証状態を返す
    return { user: null, isAuth: false };
  }
});
