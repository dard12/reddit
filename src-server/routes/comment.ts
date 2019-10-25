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
  const { body, user } = req;

  const { id, parent_id, question_id, type, is_edited } = body;
  const newId = getId();
  const comment = {
    ...body,
    id: id || newId,
    parent_id: parent_id || newId,
    is_answer: !parent_id,
  };

  const row = {
    ...comment,
    author_id: user.id,
    author_name: user.user_name,
    up_vote: 0,
    down_vote: 0,
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
  }

  res.status(200).send({ docs });

  const targetCount = type === 'response' ? 'response_count' : 'meta_count';
  const questionDoc = await pg
    .first(targetCount)
    .from('questions')
    .where({ id: question_id });

  const newCount = questionDoc[targetCount] + 1;

  await pg
    .update({ [targetCount]: newCount })
    .from('questions')
    .where({ id: question_id });
});
