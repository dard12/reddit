import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';
import execute from '../execute';

router.get('/api/comment', async (req, res) => {
  const { query } = req;
  const { groupBy } = query;
  const where = _.omit(query, ['page', 'pageSize', 'groupBy']);
  const pgQuery = pg.from('comments').where(where);

  let result;

  if (groupBy) {
    pgQuery
      .select(
        pg.raw(
          `
          (array_agg(id ORDER BY created_at DESC))[1] as id,
          MAX(created_at) as created_at
          `,
        ),
      )
      .groupBy('question_id')
      .orderByRaw('created_at DESC');

    const commentResult = await execute(pgQuery, query);
    const commentIds = _.map(commentResult.docs, 'id');

    const docs = await pg
      .select('*')
      .from('comments')
      .whereIn('id', commentIds)
      .orderByRaw('created_at DESC');

    result = { ...commentResult, docs };
  } else {
    pgQuery.select('*');
    result = await execute(pgQuery, query);
  }

  res.status(200).send(result);
});

router.post('/api/comment', requireAuth, async (req, res) => {
  const { body, user } = req;
  const { parent_id, question_id, type, edit } = body;
  const id = getId();

  if (!parent_id) {
    body.parent_id = id;
  }

  const comment = _.omit(body, 'edit');

  if (edit) {
    // EDIT
  } else {
    const docs = await pg
      .insert({
        ...comment,
        id,
        author_id: user.id,
        author_name: user.user_name,
        up_vote: 0,
        down_vote: 0,
        created_at: new Date(),
      })
      .into('comments')
      .returning('*');

    res.status(200).send({ docs });
  }

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
