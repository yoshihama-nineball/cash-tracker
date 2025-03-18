//memo: バリデーションのテストコード
// import { loginSchema } from "../../../libs/schemas/auth";

// describe('ログイン用Zodスキーマのバリデーションテスト', () => {
//   it('有効なメールアドレスとパスワードを受け入れること', () => {
//     const validData = {
//       email: 'test@example.com',
//       password: 'Password123'
//     };
    
//     const result = loginSchema.safeParse(validData);
//     expect(result.success).toBe(true);
//   });
  
//   it('無効なメールアドレスでエラーを返すこと', () => {
//     const invalidData = {
//       email: 'invalid-email',
//       password: 'Password123'
//     };
    
//     const result = loginSchema.safeParse(invalidData);
//     expect(result.success).toBe(false);
    
//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.email).toBeDefined();
//       expect(errorMap.email?.[0]).toContain('有効なメールアドレス');
//     }
//   });
  
//   it('短すぎるパスワードでエラーを返すこと', () => {
//     const invalidData = {
//       email: 'test@example.com',
//       password: 'short'
//     };
    
//     const result = loginSchema.safeParse(invalidData);
//     expect(result.success).toBe(false);
    
//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.password).toBeDefined();
//       expect(errorMap.password?.[0]).toContain('文字以上');
//     }
//   });
  
//   it('必須フィールドが欠けている場合にエラーを返すこと', () => {
//     const missingData = {
//       email: ''
//     };
    
//     const result = loginSchema.safeParse(missingData);
//     expect(result.success).toBe(false);
    
//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.email).toBeDefined();
//       expect(errorMap.password).toBeDefined();
//     }
//   });
// });