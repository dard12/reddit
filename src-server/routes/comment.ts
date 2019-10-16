import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/comment', async (req, res) => {
  const { query } = req;
  const docs = await pg
    .select('*')
    .from('comments')
    .where(query);

  res.status(200).send({ docs });
});

router.post('/api/comment', requireAuth, async (req, res) => {
  const { body, user } = req;

  await pg.insert({ ...body, author_id: user.id }).from('comments');

  res.status(200).send();
});
