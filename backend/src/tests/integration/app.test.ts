import { Accessor } from './../../../node_modules/@babel/types/lib/index-legacy.d';
import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'
import * as jwtUtils from '../../utils/jwt'
import * as authUtils from '../../utils/token'
import { generateToken } from '../../utils/token'


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

    // console.log(response.body.errors[0].msg, 'tokenが空の場合')
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


    // console.log(response.body.errors[0].msg, 'tokenが無効の場合')
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
    // console.log(response.body, 'tokenが無効な場合の結果');


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

    // console.log(globalThis, 'globalThis');

    // console.log(response.body, 'tokenが有効の場合')
    // console.log(response.statusCode, 'tokenが有効な場合のステータスコード')

    // expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual('アカウントの認証に成功しました！');
  })
})

describe('Authentication: user authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('空のフォームが入力された場合のバリデーションエラーのテストケース', async () => {
    // console.log('空のフォームが送信されました');
    const response = await request(server)
      .post('/api/auth/login')
      .send({})
    const loginMock = jest.spyOn(AuthController, 'login')

    expect(response.statusCode).toBe(400)
    expect(loginMock).not.toHaveBeenCalled()
  })
  it('メールアドレスが無効な場合のバリデーションエラーのテストケース', async () => {
    // console.log('メールアドレスが無効です');
    const userData = {
      email: 'djshdlkwhdad',
      password: 'password',
    }
    const response = await request(server)
      .post('/api/auth/login')
      .send(userData);

    const loginMock = jest.spyOn(AuthController, 'login');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual('メールアドレスは有効な形式ではありません')
    expect(loginMock).not.toHaveBeenCalled();
  })
  it('ユーザが存在しない場合のテストケース', async () => {
    // console.log('ユーザが存在しません');
    const userData = {
      email: 'not_found_user@example.com',
      password: 'password',
    }
    const response = await request(server)
      .post('/api/auth/login')
      .send(userData)

    const loginMock = jest.spyOn(AuthController, 'login');

    // (User.findOne as jest.Mock).mockResolvedValue(undefined);

    // console.log(response.body, 'ユーザが存在しない場合のレスポンスデータ');

    expect(response.status).toBe(401);
    expect(loginMock).not.toHaveBeenCalled()


  })
  it('アカウントがまだ有効化されていない場合のテストケース', async () => {
    // console.log('アカウントがまだ有効化されていません');
    (jest.spyOn(User, 'findOne') as jest.Mock)
      .mockResolvedValue({
        id: 500,
        confirmed: false,
        password: "hashed_password"
      })
    const userData = {
      email: 'yamada@example.com',
      password: 'password',
    }
    const response = await request(server)
      .post('/api/auth/login')
      .send(userData)

    const loginMock = jest.spyOn(AuthController, 'login');

    expect(response.statusCode).toBe(401)
    expect(response.body.error).toStrictEqual('アカウントがまだ有効化されていません。メールに送信された認証コードを使用してアカウントを有効化してください')
    expect(loginMock).not.toHaveBeenCalled()
  })
  it('パスワードが間違えている場合のテストケース', async () => {
    // console.log('パスワードは8文字以上で入力してください');
    const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
      .mockResolvedValue({
        id: 500,
        confirmed: true,
        password: "hashed_password"
      })
    const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(undefined);
    const userData = {
      email: 'yamada@example.com',
      password: 'wrong_password',
    }

    const response = await request(server)
      .post('/api/auth/login')
      .send(userData)

    const loginMock = jest.spyOn(AuthController, 'login');
    // console.log(response.body, 'パスワードが間違えている場合のレスポンスデータ');

    expect(response.statusCode).toBe(401);
    expect(loginMock).not.toHaveBeenCalled();
    expect(response.body.error).toStrictEqual('パスワードが間違っています')
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1)
  })
  it('ログインの成功と、JWTの検証テスト', async () => {
    // console.log('ログインに成功しました/JWTが発行されました');
    const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
      .mockResolvedValue({
        id: 500,
        confirmed: true,
        password: "hashed_password"
      })
    const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)
    const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('test_jwt')
    const userData = {
      email: 'yamada@example.com',
      password: 'pure_password',
    }
    const response = request(server)
      .post('/api/auth/login')
      .send(userData);

    // console.log((await response).body, 'ログイン成功時のレスポンスデータ');

    expect((await response).body.message).toEqual('アカウントのログインに成功しました！')
    expect((await response).body.token).toEqual('test_jwt')

    expect(checkPassword).toHaveBeenCalled()
    expect(checkPassword).toHaveBeenCalledTimes(1)
    expect(checkPassword).toHaveBeenCalledWith('pure_password', 'hashed_password')

    expect(generateJWT).toHaveBeenCalled()
    expect(generateJWT).toHaveBeenCalledTimes(1)

    expect(findOne).toHaveBeenCalledTimes(1)
  })
})

let jwt: string

async function authenticateUser() {
  const response = await request(server)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password'
    })
  // jwt = response.body;
  console.log(response.body.token, 'JWT');

  // expect(response.status).toBe(200);
}

describe('GET /api/budgets', () => {
  let jwt: string
  beforeAll(() => {
    jest.restoreAllMocks();
  })
  beforeAll(async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
    jwt = response.body.token;

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('アカウントのログインに成功しました！')
  })
  it('JWT認証されていないユーザが予算データにアクセスしようとしたときのテスト', async () => {
    const response = await request(server)
      .get('/api/budgets')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('認証が必要です')
  })

  it('JWTが無効だった時、予算データにアクセスしようとしたときのテスト', async () => {
    const response = await request(server)
      .get('/api/budgets')
      .auth('not_valid', { type: 'bearer' })

    expect(response.status).toBe(500)
    expect(response.body.error).toBe('トークンが無効です')
  })
  it('JWTが正しいとき、予算データにアクセスしようとしたときのテスト', async () => {
    const response = await request(server)
      .get('/api/budgets')
      .auth(jwt, { type: 'bearer' })

    console.log(response.body, 'JWTが正しい場合の予算アクセス時の結果');

    expect(response.body).toHaveLength(0)
    expect(response.status).not.toBe(401)
    expect(response.body.error).not.toBe('認証が必要です')
    expect(response.status).toBe(200)
  })
})
