import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { execute, getId } from '../util';

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
  const { id, parent_id, type, is_edited } = body;
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
    const { id, content } = row;

    docs = await pg('comments')
      .where({ id })
      .update({ content })
      .returning('*');
  } else {
    row.is_answer = type === 'response' && row.id === row.parent_id;

    docs = await pg
      .insert(row)
      .into('comments')
      .returning('*');

    const { id, question_id, created_at } = _.first(docs);
    const targetCount = type === 'response' ? 'response_count' : 'meta_count';

    await pg('questions')
      .where({ id: question_id })
      .increment(targetCount, 1);

    const last_comment_id = id;
    const last_commented_at = created_at;
    const update = { last_comment_id, last_commented_at };

    await pg('questions')
      .where('last_commented_at', '<', last_commented_at)
      .where({ id: question_id })
      .update(update);
  }

  res.status(200).send({ docs });
});
