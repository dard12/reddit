import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';

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
  const { parent_id, question_id, type } = body;
  const id = getId();

  if (!parent_id) {
    body.parent_id = id;
  }

  const docs = await pg
    .insert({
      ...body,
      id,
      author_id: user.id,
      up_vote: 0,
      down_vote: 0,
      created_at: new Date(),
    })
    .into('comments')
    .returning('*');

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
