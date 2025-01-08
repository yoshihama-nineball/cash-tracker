import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'


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
    expect(response.body.errors[0].msg).toEqual(
      'メールアドレスは有効な形式ではありません',
    )
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
    // console.log(response.body.errors[0].msg, 'パスワードが8文字未満だった時のバリデーションエラー');

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
    // console.log(response.body.errors, 'すでにメールアドレスが登録されている場合');

    const createAccountMock = jest.spyOn(AuthController, 'createAccount')

    //MEMO: メアドが重複している場合のエラーは、上の他のテストコードたちと違い、
    //MEMO: appRouter内でのエラーではないので、ここのテストケースではレスポンスは期待できない
    expect(response.statusCode).toBe(409)
    expect(response.body).not.toHaveProperty('errors')
    expect(createAccountMock).not.toHaveBeenCalled()
  })
})

describe('Authentication: confirm account', () => {

  it('tokenが空で送信された場合のユーザ確認時のバリデーションエラーのテストケース', async () => {
    // console.log('tokenが空で送信された場合のユーザ確認時のバリデーションエラー');
    // const userData = {
    //   token: ''
    // }
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({})

    console.log(response.body.errors[0].msg, 'tokenが空の場合')
    const confirmAccountMock = jest.spyOn(AuthController, 'confirmAccount')

    expect(response.statusCode).toBe(400)
    expect(response.body.errors[0].msg).toEqual('認証コードは必須です');
    expect(confirmAccountMock).not.toHaveBeenCalled()
    expect(response.body.errors[0]).toHaveProperty('msg')
  })

  it('tokenが6文字でない場合のユーザ確認時のバリデーションエラーのテストケース', async () => {
    // console.log('tokenが無効な場合のユーザ確認時のバリデーションエラー');
    const userData = {
      token: '3493'
    }
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send(userData)


    console.log(response.body.errors[0].msg, 'tokenが無効の場合')
    const confirmAccountMock = jest.spyOn(AuthController, 'confirmAccount')

    expect(response.statusCode).toBe(400)
    expect(response.body.errors[0].msg).toEqual('トークンが無効です');
    expect(confirmAccountMock).not.toHaveBeenCalled()
    expect(response.body.errors[0]).toHaveProperty('msg')
  })

  it('tokenが存在しない場合のテストケース', async () => {
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({
        token: "123456"
      })
    console.log(response.body, 'tokenが無効な場合の結果');


    expect(response.status).toBe(401)
    // expect(response).toHaveProperty('body')
    expect(response.body).toStrictEqual({ error: '認証コードが無効です' })
    expect(response.status).not.toBe(200)
  })

  it('tokenが有効な場合のユーザ確認時のテストケース', async () => {
    const token = globalThis.cashTrackerConfirmation
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({ token })

    console.log(globalThis, 'globalThis');

    console.log(response.body, 'tokenが有効の場合')
    console.log(response.statusCode, 'tokenが有効な場合のステータスコード')

    // expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual('アカウントの認証に成功しました！');
  })

})
