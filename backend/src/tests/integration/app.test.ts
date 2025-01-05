import request from 'supertest';
import server, { connectDB } from '../../server';

describe('First Integration test', () => {
  beforeEach(async () => {
    await connectDB;
  });

  it('200ステータスコードを返すテストケース', async () => {
    const response = await request(server).get('/');
    console.log(response.statusCode);
    console.log(response.status);
    console.log(response.text);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('ユニットテストの動作確認');
  });
});

describe('GET /api/hello', () => {
  it('hello worldメッセージ', async () => {
    console.log('Starting test for GET /api/hello');
    try {
      const res = await request(server).get('/api/hello');
      console.log('Received response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Hello, world!');
    } catch (error) {
      console.error('Test failed', error);
      throw error;
    }
  });
});
