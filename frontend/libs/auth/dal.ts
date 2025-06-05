"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { UserSchema } from "../schemas/auth";

export const verifySession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("CASHTRACKR_TOKEN");

    if (!token) {
      return { user: null, isAuth: false };
    }

    const jwtToken = token.value;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/user`;
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
