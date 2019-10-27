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
  };

  const existParams = _.omit(row, ['id', 'vote_type']);

  const exists = await pg
    .select('*')
    .from('comment_votes')
    .where(existParams);

  let result;

  if (!exists || _.isEmpty(exists)) {
    result = await pg
      .insert(row)
      .into('comment_votes')
      .returning('*');

    if (row.vote_type === 'up_vote') {
      await pg
        .increment('up_votes', 1)
        .into('comments')
        .where({ id: row.comment_id });
    } else {
      await pg
        .increment('down_votes', 1)
        .into('comments')
        .where({ id: row.comment_id });
    }
  } else {
    const updateParams = {
      ...row,
      id: exists[0]['id'],
    };

    result = await pg.update(updateParams).returning('*');

    // this could probably be compacted
    const currentType = exists[0]['vote_type'];
    if (currentType !== row.vote_type) {
      if (row.vote_type == 'up_vote') {
        await pg
          .decrement('down_votes', 1)
          .into('comments')
          .where({ id: updateParams.comment_id });

        await pg
          .increment('up_votes', 1)
          .into('comments')
          .where({ id: updateParams.comment_id });
      } else {
        await pg
          .increment('down_votes', 1)
          .into('comments')
          .where({ id: updateParams.comment_id });

        await pg
          .decrement('up_votes', 1)
          .into('comments')
          .where({ id: updateParams.comment_id });
      }
    }
  }

  res.status(200).send({ result });
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
  };

  const existParams = _.omit(row, ['id', 'vote_type']);

  const exists = await pg
    .select('*')
    .from('question_votes')
    .where(existParams);

  let result;

  if (!exists || _.isEmpty(exists)) {
    result = await pg
      .insert(row)
      .into('question_votes')
      .returning('*');

    if (row.vote_type === 'up_vote') {
      await pg
        .increment('up_votes', 1)
        .into('questions')
        .where({ id: row.question_id });
    } else {
      await pg
        .increment('down_votes', 1)
        .into('questions')
        .where({ id: row.question_id });
    }
  } else {
    const updateParams = {
      ...row,
      id: exists[0]['id'],
    };

    result = await pg.update(updateParams).returning('*');

    const currentType = exists[0]['vote_type'];
    if (currentType !== row.vote_type) {
      if (row.vote_type == 'up_vote') {
        await pg
          .decrement('down_votes', 1)
          .into('questions')
          .where({ id: updateParams.question_id });

        await pg
          .increment('up_votes', 1)
          .into('questions')
          .where({ id: updateParams.question_id });
      } else {
        await pg
          .increment('down_votes', 1)
          .into('questions')
          .where({ id: updateParams.question_id });

        await pg
          .decrement('up_votes', 1)
          .into('questions')
          .where({ id: updateParams.question_id });
      }
    }
  }

  res.status(200).send({ result });
});

router.get('/api/question_vote', async (req, res) => {
  const result = await pg
    .select('*')
    .from('question_votes')
    .where(req);

  res.status(200).send({ result });
});
