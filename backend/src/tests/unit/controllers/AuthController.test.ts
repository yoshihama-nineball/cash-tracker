import { AuthEmail } from '../../../emails/AuthEmail';
import User from '../../../models/User';
import { hashPassword } from '../../../utils/auth';
import { generateJWT } from '../../../utils/jwt';
import { checkPassword, generateToken } from '../../../utils/token';
import { AuthController } from './../../../controllers/AuthController';
import { createRequest, createResponse } from "node-mocks-http";

jest.mock('../../../models/User')
jest.mock('../../../utils/auth.ts')
jest.mock('../../../utils/token.ts')
jest.mock('../../../utils/jwt.ts')

describe('AuthController.createAccount', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('ユーザ登録時に、すでにメールアドレスが登録されていた場合', async () => {

    (User.findOne as jest.Mock).mockResolvedValue(true)

    const req = createRequest({
      method: 'POST',
      url: '/api/auth/create-account',
      body: {
        email: "test@test.com",
        password: "testpassword"
      }
    })
    const res = createResponse()

    await AuthController.createAccount(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(409)
    expect(data).toStrictEqual({ error: 'そのメールアドレスは既に登録されています。' })
    expect(User.findOne).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledTimes(1)
  })
  it('ユーザ登録成功時のテスト', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null)
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/create-account',
      body: {
        email: "test@test.com",
        password: "testpassword",
        name: "Test Name"
      }
    })
    const res = createResponse()
    const mockUser = { ...req.body, save: jest.fn() };

    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (hashPassword as jest.Mock).mockReturnValue('alsjalslj./fh');
    (generateToken as jest.Mock).mockReturnValue('123456');
    jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

    await AuthController.createAccount(req, res)

    expect(User.create).toHaveBeenCalledWith(req.body)
    expect(User.create).toHaveBeenCalledTimes(1)
    expect(mockUser.save).toHaveBeenCalled()
    expect(mockUser.password).toBe('alsjalslj./fh')
    expect(mockUser.token).toBe('123456')
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: req.body.name,
      email: req.body.email,
      token: '123456'
    })
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(201)
  })


  it('ユーザ登録時、何らかの不具合があったときのテスト', async () => {
    const mockUser = {
      save: jest.fn(),
    };
    (User.create as jest.Mock).mockRejectedValue(new Error())
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/create-account',
      body: {
        email: "test@test.com",
        password: "testpassword",
        name: "Test Name"
      }
    })
    const res = createResponse()

    await AuthController.createAccount(req, res)

    const data = res._getJSONData()

    expect(mockUser.save).not.toHaveBeenCalled()
    expect(data).toStrictEqual({ error: 'ユーザ作成中にエラーが発生しました' })
    expect(res.statusCode).toBe(500)
  })
})

describe('AuthController.login', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('ユーザが存在しないときのテスト', async () => {
    // console.log('ユーザが存在しない場合のテストケース');

    // const mockUser = { body: {email: 'test@example.com'} };

    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: "test@example.com",
        password: "testpassword"
      }
    });

    (User.findOne as jest.Mock).mockResolvedValue(undefined);
    const res = createResponse()

    await AuthController.login(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(401)
    expect(data).toStrictEqual({
      error: 'ユーザが見つかりません'

    })
    expect(User.findOne).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledTimes(1)
  })
  it('アカウントが有効化されていない場合のテスト', async () => {
    // console.log('アカウントが有効化されていない場合のテストケース');

    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: "test@example.com",
        password: "testpassword"
      }
    });

    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "password",
      confirmed: false
    })

    const res = createResponse()

    await AuthController.login(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(401)
    expect(data).toStrictEqual({ error: 'アカウントがまだ有効化されていません。メールに送信された認証コードを使用してアカウントを有効化してください' })
    expect(User.findOne).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@example.com",
      }
    });

  })
  it('パスワードが間違っている場合のテストケース', async () => {
    // console.log('パスワードが間違っている場合のテストケース');
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: "test@example.com",
        password: "testpassword"
      }
    });

    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "wrongpassword",
      confirmed: true
    });
    (checkPassword as jest.Mock).mockResolvedValue(false)
    const res = createResponse()

    await AuthController.login(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(401)
    expect(data).toStrictEqual({ error: 'パスワードが間違っています' })
    expect(User.findOne).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@example.com",
      }
    });
  })
  it('認証が正しいかどうかのテスト', async () => {
    // console.log('認証が正しいかどうかのテストケース');

    const userMock = {
      id: 1,
      email: "test@example.com",
      password: "testpassword",
      confirmed: true
    };
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: "test@example.com",
        password: "testpassword"
      }
    });
    const res = createResponse();

    const temporaryJWT = 'temporary_jwt';

    (User.findOne as jest.Mock).mockResolvedValue(userMock);
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(temporaryJWT);

    await AuthController.login(req, res)

    const data = res._getJSONData()
    // console.log(data, 'JWT結果');

    expect(res.statusCode).toBe(200)
    expect(data).toEqual({
      message: 'アカウントのログインに成功しました！',
      token: temporaryJWT
    })
    expect(generateJWT).toHaveBeenCalledTimes(1)
    expect(generateJWT).toHaveBeenCalledWith(userMock.id)
  })
  it('何らかの不具合で認証できなかった場合のテストケース', async () => {
    // console.log('認証が正しいかどうかのテストケース');

    const userMock = {
      id: 1,
      email: "test@example.com",
      password: "testpassword",
      confirmed: true
    };
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: "test@example.com",
        password: "testpassword"
      }
    });
    const res = createResponse();

    const temporaryJWT = 'temporary_jwt';

    (User.findOne as jest.Mock).mockRejectedValue(new Error());
    // (checkPassword as jest.Mock).mockRejectedValue(new Error());
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(temporaryJWT);

    await AuthController.login(req, res)

    const data = res._getJSONData()
    // console.log(data, 'JWT結果');

    expect(res.statusCode).toBe(500)
    expect(data).toStrictEqual({ error: 'サーバーエラーが発生しました' })
    expect(generateJWT).not.toHaveBeenCalled()
    expect(generateJWT).not.toHaveBeenCalledWith(userMock.id)
  })
})