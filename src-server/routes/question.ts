import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/question', async (req, res) => {
  const { query } = req;
  const docs = await pg
    .select('*')
    .from('questions')
    .where(query);

  res.status(200).send({ docs });
});

router.post('/api/question', requireAuth, async (req, res) => {
  // const { body, user } = req;
});
