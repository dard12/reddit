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
  const { parent_id } = body;
  const id = getId();

  if (!parent_id) {
    body.parent_id = id;
  }

  await pg
    .insert({
      ...body,
      id,
      author_id: user.id,
      up_vote: 0,
      down_vote: 0,
      created_at: new Date(),
    })
    .into('comments');

  res.status(200).send();
});
