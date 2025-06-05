//MEMO:テストコードのテンプレ
//memo: APIクライアント/認証サービスのテスト
// import { loginUser } from '@/services/auth-service';
// import { apiClient } from '@/libs/api-client';

// // APIクライアントのモック
// jest.mock('@/libs/api-client', () => ({
//   apiClient: {
//     post: jest.fn()
//   }
// }));

// // セッションストレージのモック
// jest.mock('@/utils/storage', () => ({
//   setAuthToken: jest.fn(),
//   removeAuthToken: jest.fn()
// }));

// import { setAuthToken, removeAuthToken } from '@/utils/storage';

// describe('認証サービスのテスト', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('ログイン成功時にトークンを保存しレスポンスを返すこと', async () => {
//     // APIの成功レスポンスをモック
//     (apiClient.post as jest.Mock).mockResolvedValue({
//       data: {
//         success: true,
//         user: { id: '123', email: 'test@example.com' },
//         token: 'jwt-token-123'
//       }
//     });

//     const result = await loginUser({
//       email: 'test@example.com',
//       password: 'Password123'
//     });

//     // APIが適切なエンドポイントとデータで呼ばれたか確認
//     expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
//       email: 'test@example.com',
//       password: 'Password123'
//     });

//     // トークンが保存されたか確認
//     expect(setAuthToken).toHaveBeenCalledWith('jwt-token-123');

//     // 適切なレスポンスが返されたか確認
//     expect(result).toEqual({
//       success: true,
//       userId: '123',
//       token: 'jwt-token-123'
//     });
//   });

//   it('ログイン失敗時に適切なエラーレスポンスを返すこと', async () => {
//     // APIのエラーレスポンスをモック
//     (apiClient.post as jest.Mock).mockResolvedValue({
//       data: {
//         success: false,
//         errors: ['Invalid credentials']
//       }
//     });

//     const result = await loginUser({
//       email: 'test@example.com',
//       password: 'WrongPassword'
//     });

//     // トークンが削除されたか確認
//     expect(removeAuthToken).toHaveBeenCalled();

//     // 適切なエラーレスポンスが返されたか確認
//     expect(result).toEqual({
//       success: false,
//       errors: ['Invalid credentials']
//     });
//   });

//   it('ネットワークエラー時に適切なエラーハンドリングを行うこと', async () => {
//     // ネットワークエラーをモック
//     (apiClient.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

//     const result = await loginUser({
//       email: 'test@example.com',
//       password: 'Password123'
//     });

//     // トークンが削除されたか確認
//     expect(removeAuthToken).toHaveBeenCalled();

//     // 適切なエラーレスポンスが返されたか確認
//     expect(result).toEqual({
//       success: false,
//       errors: ['サーバーとの通信中にエラーが発生しました']
//     });
//   });

//   it('レート制限エラー時に適切なエラーメッセージを返すこと', async () => {
//     // レート制限エラーをモック
//     (apiClient.post as jest.Mock).mockRejectedValue({
//       response: {
//         status: 429,
//         data: {
//           message: 'Too many login attempts'
//         }
//       }
//     });

//     const result = await loginUser({
//       email: 'test@example.com',
//       password: 'Password123'
//     });

//     // 適切なエラーレスポンスが返されたか確認
//     expect(result).toEqual({
//       success: false,
//       errors: ['ログイン試行回数が多すぎます。しばらく経ってから再試行してください']
//     });
//   });
// });
