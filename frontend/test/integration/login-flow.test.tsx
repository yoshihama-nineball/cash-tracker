//MEMO: 結合試験のテンプレ
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
// import LoginForm from '@/components/auth/LoginForm';

// // MSWサーバーの設定
// const server = setupServer(
//   // 成功レスポンスのモック
//   rest.post('/api/login', (req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.json({ success: true, user: { id: '123' }, token: 'test-token' })
//     );
//   })
// );

// // ナビゲーションのモック
// const mockRouter = {
//   push: jest.fn(),
//   prefetch: jest.fn()
// };

// jest.mock('next/navigation', () => ({
//   useRouter: () => mockRouter,
//   redirect: jest.fn()
// }));

// // トークンストレージのモック
// const mockSetItem = jest.fn();
// Object.defineProperty(window, 'localStorage', {
//   value: {
//     setItem: mockSetItem,
//     getItem: jest.fn(),
//     removeItem: jest.fn()
//   }
// });

// beforeAll(() => server.listen());
// afterEach(() => {
//   server.resetHandlers();
//   jest.clearAllMocks();
// });
// afterAll(() => server.close());

// describe('ログインフロー統合テスト', () => {
//   it('成功した場合、ダッシュボードにリダイレクトすること', async () => {
//     render(<LoginForm />);
    
//     // 入力フィールドにデータを入力
//     await userEvent.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com');
//     await userEvent.type(screen.getByLabelText(/パスワード/i), 'Password123');
    
//     // フォーム送信
//     fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
//     // ロード中状態を確認
//     expect(screen.getByText(/送信中.../i)).toBeInTheDocument();
    
//     // 成功メッセージとリダイレクトを待つ
//     await waitFor(() => {
//       expect(screen.getByText(/成功/i)).toBeInTheDocument();
//       expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
//     });
    
//     // トークンが保存されたか確認
//     expect(mockSetItem).toHaveBeenCalledWith('auth_token', expect.any(String));
//   });
  
//   it('失敗した場合、エラーメッセージを表示すること', async () => {
//     // エラーレスポンスをモック
//     server.use(
//       rest.post('/api/login', (req, res, ctx) => {
//         return res(
//           ctx.status(401),
//           ctx.json({ success: false, errors: ['メールアドレスまたはパスワードが間違っています'] })
//         );
//       })
//     );
    
//     render(<LoginForm />);
    
//     // 入力フィールドにデータを入力
//     await userEvent.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com');
//     await userEvent.type(screen.getByLabelText(/パスワード/i), 'WrongPassword');
    
//     // フォーム送信
//     fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
//     // エラーメッセージを待つ
//     await waitFor(() => {
//       expect(screen.getByText(/メールアドレスまたはパスワードが間違っています/i)).toBeInTheDocument();
//     });
    
//     // リダイレクトされないことを確認
//     expect(mockRouter.push).not.toHaveBeenCalled();
//   });
  
//   it('バリデーションエラーがあるとき、APIが呼ばれないこと', async () => {
//     // スパイを設定してAPIリクエストを監視
//     const fetchSpy = jest.spyOn(global, 'fetch');
    
//     render(<LoginForm />);
    
//     // 無効なメールアドレスを入力
//     await userEvent.type(screen.getByLabelText(/メールアドレス/i), 'invalid-email');
//     await userEvent.type(screen.getByLabelText(/パスワード/i), 'short');
    
//     // フォーム送信
//     fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
//     // バリデーションエラーメッセージを待つ
//     await waitFor(() => {
//       expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
//       expect(screen.getByText(/パスワードは8文字以上/i)).toBeInTheDocument();
//     });
    
//     // APIが呼ばれていないことを確認
//     expect(fetchSpy).not.toHaveBeenCalled();
//   });
  
//   it('サーバーエラー時、適切なエラーメッセージを表示すること', async () => {
//     // サーバーエラーをモック
//     server.use(
//       rest.post('/api/login', (req, res, ctx) => {
//         return res(
//           ctx.status(500),
//           ctx.json({ success: false, errors: ['サーバーエラーが発生しました'] })
//         );
//       })
//     );
    
//     render(<LoginForm />);
    
//     // 入力フィールドにデータを入力
//     await userEvent.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com');
//     await userEvent.type(screen.getByLabelText(/パスワード/i), 'Password123');
    
//     // フォーム送信
//     fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
//     // エラーメッセージを待つ
//     await waitFor(() => {
//       expect(screen.getByText(/サーバーエラーが発生しました/i)).toBeInTheDocument();
//     });
//   });
  
//   it('ネットワークエラー時、適切なエラーメッセージを表示すること', async () => {
//     // ネットワークエラーをモック
//     server.use(
//       rest.post('/api/login', (req, res) => {
//         return res.networkError('Failed to connect');
//       })
//     );
    
//     render(<LoginForm />);
    
//     // 入力フィールドにデータを入力
//     await userEvent.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com');
//     await userEvent.type(screen.getByLabelText(/パスワード/i), 'Password123');
    
//     // フォーム送信
//     fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
//     // エラーメッセージを待つ
//     await waitFor(() => {
//       expect(screen.getByText(/サーバーとの通信中にエラーが発生しました/i)).toBeInTheDocument();
//     });
//   });
// });