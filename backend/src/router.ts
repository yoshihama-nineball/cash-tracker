import { Router } from 'express';

const router = Router();

// ルートのサンプル
router.get('/', (req, res) => {
  res.send('Hello, world!');
});

export default router;
