import request from 'supertest';
import server, { connectDB } from '../../server';
import { AuthController } from '../../controllers/AuthController';

describe('Authentication: create account', () => {
  it('入力フォームが空だった時のバリデーションエラーのテストケース', async () => {
    const response = await request(server)
      .post('/api/auth/create-account')
      .send({})
    // console.log(response.text, '入力フォームが空だった時のバリデーションエラー');

    const createAccountMock = jest.spyOn(AuthController, 'createAccount')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(4)

    //MEMO: authRouterのバリデーションエラーで引っかかるため、
    //MEMO: その後に呼び出されるはずのAuthControllerは呼ばれない
    expect(createAccountMock).not.toHaveBeenCalled()
  })

  it('メールアドレスが無効だった時のバリデーションエラーのテストケース', async () => {
    // console.log('アドレスが無効です');
    const userData = {
      name: '山田太郎',
      email: 'invalid-email',
      password: 'test12345',
    }
    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    // console.log(response.text, 'メアドが無効だった時のバリデーションエラー');

    const createAccountMock = jest.spyOn(AuthController, 'createAccount')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(createAccountMock).not.toHaveBeenCalled()
    expect(response.body.errors[0].msg).toEqual('メールアドレスは有効な形式ではありません')
  })

  it('パスワードが8文字未満だった時のバリデーションエラーのテストケース', async () => {
    // console.log('パスワードは8文字以上で入力してください');
    const userData = {
      name: '山田太郎',
      email: 'test@example.com',
      password: 'pass',
    }
    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    console.log(response.body.errors[0].msg, 'パスワードが8文字未満だった時のバリデーションエラー');

    const createAccountMock = jest.spyOn(AuthController, 'createAccount')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(createAccountMock).not.toHaveBeenCalled()
    expect(response.body.errors[0].msg).toEqual('パスワードは8文字以上です')
  })
  it('パスワードとメールアドレスの入力が有効だった時のテストケース', async () => {
    // console.log('成功！');
    const userData = {
      name: '山田太郎',
      email: 'test@example.com',
      password: 'password',
    }
    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    // console.log(response.body.message, 'アカウントを作成しました');
  })
  it('ユーザ登録時に、すでにメールアドレスが登録されていた場合のテストケース', async () => {
    const userData = {
      name: '山田太郎',
      email: 'test@example.com',
      password: 'password',
    }
    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    console.log(response.body.errors.msg, 'すでにメールアドレスが登録されている場合');

    const createAccountMock = jest.spyOn(AuthController, 'createAccount')

    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(createAccountMock).not.toHaveBeenCalled()
    expect(response.body.errors.msg).toEqual('そのメールアドレスは既に登録されています。')
  })
})