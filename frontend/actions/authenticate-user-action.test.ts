import { LoginSchema } from "../libs/schemas/auth";
import { authenticate } from './authenticate-user-action';

// process.env.API_URLを設定
process.env.API_URL = 'http://localhost:4000/api';

// next/headersのモック
jest.mock('next/headers', () => {
  const mockCookieStore = {
    set: jest.fn(),
  };
  return {
    cookies: jest.fn(() => mockCookieStore),
  };
});

// LoginSchemaのモック
jest.mock("../libs/schemas/auth", () => {
  return {
    LoginSchema: {
      safeParse: jest.fn(),
    },
  };
});

// グローバルなfetchをモック
global.fetch = jest.fn();

// console.errorをモック
console.error = jest.fn();

describe('authenticate関数', () => {
  const prevState = { errors: [], success: '' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('バリデーションエラーの場合、エラーメッセージを返す', async () => {
    // バリデーション失敗のモック
    (LoginSchema.safeParse).mockReturnValue({
      success: false,
      error: {
        errors: [
          { message: 'メールアドレスの形式が正しくありません' },
          { message: 'パスワードは8文字以上で入力してください' }
        ]
      }
    });

    // FormDataを作成
    const formData = new FormData();
    formData.append('email', 'invalid-email');
    formData.append('password', '123');

    const result = await authenticate(prevState, formData);

    // fetchは呼ばれない
    expect(fetch).not.toHaveBeenCalled();
    
    // エラーメッセージが含まれている
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('メールアドレスの形式が正しくありません');
    expect(result.errors).toContain('パスワードは8文字以上で入力してください');
    expect(result.success).toBe('');
  });

  it('認証に成功した場合、成功メッセージとリダイレクトURLを返す', async () => {
    // バリデーション成功のモック
    (LoginSchema.safeParse).mockReturnValue({
      success: true,
      data: {
        email: 'user@example.com',
        password: 'password123'
      }
    });

    // fetchのレスポンスをモック
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue('mock-token'),
    };
    fetch.mockResolvedValue(mockResponse);

    // FormDataを作成
    const formData = new FormData();
    formData.append('email', 'user@example.com');
    formData.append('password', 'password123');

    const result = await authenticate(prevState, formData);

    // APIが正しいパラメータで呼ばれる
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/auth/login`,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    // bodyの内容を個別に検証（順序に依存しないため）
    const callArgs = fetch.mock.calls[0][1];
    const bodyContent = JSON.parse(callArgs.body);
    expect(bodyContent).toEqual({
      email: 'user@example.com',
      password: 'password123'
    });

    // cookieが設定される
    const cookieStore = require('next/headers').cookies();
    expect(cookieStore.set).toHaveBeenCalledWith({
      name: 'CASHTRACKR_TOKEN',
      value: 'mock-token',
      httpOnly: true,
      path: '/',
      secure: expect.any(Boolean),
      sameSite: 'strict',
    });

    // 成功レスポンス
    expect(result).toEqual({
      errors: [],
      success: 'ログインに成功しました',
      redirectUrl: '/budgets',
    });
  });

  it('APIがエラーを返した場合、エラーメッセージを返す', async () => {
    // バリデーション成功のモック
    (LoginSchema.safeParse).mockReturnValue({
      success: true,
      data: {
        email: 'user@example.com',
        password: 'password123'
      }
    });

    // FormDataを作成
    const formData = new FormData();
    formData.append('email', 'user@example.com');
    formData.append('password', 'password123');

    // 認証失敗のモック
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Authentication failed' }),
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await authenticate(prevState, formData);

    // APIが呼ばれる
    expect(fetch).toHaveBeenCalled();
    
    // エラーメッセージ
    expect(result).toEqual({
      errors: ['メールアドレスまたはパスワードが正しくありません'],
      success: '',
    });
    
    // cookieは設定されない
    const cookieStore = require('next/headers').cookies();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it('APIリクエスト中に例外が発生した場合、エラーメッセージを返す', async () => {
    // バリデーション成功のモック
    (LoginSchema.safeParse).mockReturnValue({
      success: true,
      data: {
        email: 'user@example.com',
        password: 'password123'
      }
    });

    // FormDataを作成
    const formData = new FormData();
    formData.append('email', 'user@example.com');
    formData.append('password', 'password123');

    // ネットワークエラーなどのシミュレーション
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await authenticate(prevState, formData);

    // APIが呼ばれる
    expect(fetch).toHaveBeenCalled();
    
    // エラーログ
    expect(console.error).toHaveBeenCalled();
    
    // エラーメッセージ
    expect(result).toEqual({
      errors: ['ログイン処理中にエラーが発生しました。後ほど再試行してください。'],
      success: '',
    });
  });
});