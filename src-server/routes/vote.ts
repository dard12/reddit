import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';

router.post('/api/comment_vote', requireAuth, async (req, res) => {

  const { body, user } = req;

  const row = {
    ...body,
    id: getId(),
    user_id: user.id,
  }

  res = await pg
    .insert(row)
    .into('comment_votes')
    .returning('*');


  // TODO: increment vote count on comment

  res.status(200).send({ res });
});

router.get('/api/comment_vote', async (req, res) => {

  const result = await pg
    .select('*')
    .from('comment_votes')
    .where(req);

  res.status(200).send({ result });
});

router.post('/api/question_vote', requireAuth, async (req, res) => {

  const { body, user } = req;

  const row = {
    ...body,
    id: getId(),
    user_id: user.id,
  }

  res = await pg
    .insert(row)
    .into('question_votes')
    .returning('*');


  // TODO: increment vote count on comment

  res.status(200).send({ res });
});

router.get('/api/question_vote', async (req, res) => {

  const result = await pg
    .select('*')
    .from('question_votes')
    .where(req);

  res.status(200).send({ result });
});
