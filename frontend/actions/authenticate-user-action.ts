"use server";

import { cookies } from 'next/headers';
import { LoginSchema } from "../libs/schemas/auth";

// 型定義
type ActionStateType = {
    errors: string[];
    success: string;
    redirectUrl?: string;
}

export async function authenticate(prevState: ActionStateType, formData: FormData) {
    const loginCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    // バリデーション
    const auth = LoginSchema.safeParse(loginCredentials);
    if(!auth.success) {
        return {
            errors: auth.error.errors.map(issue => issue.message),
            success: ""
        }
    }

    // API リクエスト
    try {
        const url = `${process.env.API_URL}/auth/login`;
        const req = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: auth.data.password,
                email: auth.data.email
            }),
            // 重要: クレデンシャルを含める
            credentials: 'include'
        });

        const json = await req.json();
        
        if(!req.ok) {
            return {
                errors: ["メールアドレスまたはパスワードが正しくありません"],
                success: ""
            }
        }

        // 認証成功の処理
        const cookieStore = cookies();
        cookieStore.set({
            name: 'CASHTRACKR_TOKEN',
            value: json,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // 成功情報とリダイレクト先を返す
        return {
            errors: [],
            success: "ログインに成功しました",
            redirectUrl: "/budgets"
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            errors: ["ログイン処理中にエラーが発生しました。後ほど再試行してください。"],
            success: ""
        }
    }
}