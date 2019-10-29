import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';
import execute from '../execute';

router.get('/api/comment', async (req, res) => {
  const { query } = req;
  const where = _.omit(query, ['page', 'pageSize']);
  const pgQuery = pg
    .select('*')
    .from('comments')
    .where(where);

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/comment', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { id, parent_id, question_id, type, is_edited } = body;
  const newId = getId();
  const comment = {
    ...body,
    id: id || newId,
    parent_id: parent_id || newId,
  };

  const row = {
    ...comment,
    author_id: user.id,
    author_name: user.user_name,
    up_votes: 0,
    down_votes: 0,
  };

  let docs;

  if (!parent_id) {
    body.parent_id = row.id;
  }

  if (is_edited) {
    docs = await pg('comments')
      .where({ id: row.id })
      .update(row)
      .returning('*');
  } else {
    docs = await pg
      .insert(row)
      .into('comments')
      .returning('*');

    const targetCount = type === 'response' ? 'response_count' : 'meta_count';
    await pg('questions').increment(targetCount, 1);

    const last_comment_id = docs[0].id;
    const last_commented_at = docs[0].created_at;
    const update = { last_comment_id, last_commented_at };

    await pg('questions')
      .where('last_commented_at', '<', last_commented_at)
      .where({ id: docs[0].question_id })
      .update(update);
  }

  res.status(200).send({ docs });
});
