import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/question', async (req, res) => {
  const { query } = req;
  const where = _.omit(query, 'search');
  const docs = await pg
    .select('*')
    .from('questions')
    .where(where);

  res.status(200).send({ docs });
});

router.post('/api/question', requireAuth, async (req, res) => {
  const { body, user } = req;

  await pg.insert({ ...body, author_id: user.id }).from('questions');

  res.status(200).send();
});
