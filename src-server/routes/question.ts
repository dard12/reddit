import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';

router.get('/api/question', async (req, res) => {
  const { query } = req;
  const { sort } = query;
  let search = null;
  if (query.search) {
    search = JSON.parse(query.search);
  }
  const where = _.omit(query, ['search', 'sort']);

  const pgQuery = pg
    .select('*')
    .from('questions')
    .where(where);

  if (sort) {
    pgQuery.orderBy(sort, 'desc');
  }

  const docs = await pgQuery;

  res.status(200).send({ docs });
});

router.post('/api/question', requireAuth, async (req, res) => {
  const { body, user } = req;
  const docs = await pg
    .insert({
      ...body,
      id: getId(),
      author_id: user.id,
      response_count: 0,
      meta_count: 0,
      up_vote: 0,
      down_vote: 0,
    })
    .into('questions')
    .returning('*');

  res.status(200).send({ docs });
});
