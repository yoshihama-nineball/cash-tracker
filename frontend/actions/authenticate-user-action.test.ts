import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextRequest, NextResponse } from 'next/server';
import { LoginForm } from '../path/to/LoginForm';
import { authenticate } from '../path/to/authenticate';
import * as nextHeaders from 'next/headers';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// authenticate関数のモック
vi.mock('../path/to/authenticate', () => ({
  authenticate: vi.fn(),
}));

// next/headersのモック
vi.mock('next/headers', () => {
  const cookiesSet = vi.fn();
  return {
    cookies: vi.fn(() => ({
      set: cookiesSet,
      get: vi.fn(),
    })),
    cookiesSet, // モック関数への直接アクセス用
  };
});

// next/navigationのモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('認証フロー統合テスト', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('成功時のフロー: フォーム送信 → 認証 → リダイレクト', async () => {
    // 認証成功のモック
    authenticate.mockResolvedValue({
      errors: [],
      success: 'ログインに成功しました',
      redirectUrl: '/budgets',
    });

    render(<LoginForm />);

    // フォーム入力
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'user@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'password123' },
    });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // 成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ログインに成功しました')).toBeInTheDocument();
    });

    // authenticate関数が正しく呼び出されたことを確認
    expect(authenticate).toHaveBeenCalledWith(
      expect.anything(), // prevState
      expect.any(FormData) // formData
    );

    // リダイレクトが発生することを確認（useRouterのモックをチェック）
    await waitFor(() => {
      expect(require('next/navigation').useRouter().push).toHaveBeenCalledWith('/budgets');
    });
  });

  it('失敗時のフロー: フォーム送信 → 認証エラー → エラーメッセージ表示', async () => {
    // 認証失敗のモック
    authenticate.mockResolvedValue({
      errors: ['メールアドレスまたはパスワードが正しくありません'],
      success: '',
    });

    render(<LoginForm />);

    // フォーム入力
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'user@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'wrong-password' },
    });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('メールアドレスまたはパスワードが正しくありません')).toBeInTheDocument();
    });

    // リダイレクトは発生しないことを確認
    expect(require('next/navigation').useRouter().push).not.toHaveBeenCalled();
  });

  it('バリデーション失敗のフロー: 無効な入力 → クライアント側バリデーション', async () => {
    render(<LoginForm />);

    // 無効なメールアドレス
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: '123' }, // 短すぎるパスワード
    });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // クライアント側のバリデーションエラーが表示されることを確認
    await waitFor(() => {
      // React Hook FormとZodの具体的なエラーメッセージに合わせて変更する必要があります
      expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
      expect(screen.getByText(/パスワードは8文字以上である必要があります/i)).toBeInTheDocument();
    });

    // authenticate関数は呼び出されないことを確認（クライアント側バリデーションで止まるため）
    expect(authenticate).not.toHaveBeenCalled();
  });
});