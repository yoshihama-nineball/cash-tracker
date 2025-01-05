import request from 'supertest'
import server, { connectDB } from '../../server'

describe('First Integration test', () => {
  beforeEach(async () => {
    await connectDB;
  })
  it('200ステータスコードを返すテストケース', async () => {
    const response = await request(server).get('/')
    console.log(response.statusCode)
    console.log(response.status)
    console.log(response.text)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('ユニットテストの動作確認')
  })
})
