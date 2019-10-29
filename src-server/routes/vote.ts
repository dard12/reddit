import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';
import { Request, Response } from 'express-serve-static-core';

enum VoteType {
  Question,
  Comment,
}

function getVoteConfig(type: VoteType) {
  let vote_table;
  let object_table;
  let vote_object_id_property;
  if (type === VoteType.Question) {
    vote_table = 'question_votes';
    object_table = 'questions';
    vote_object_id_property = 'question_id';
  } else {
    vote_table = 'comment_votes';
    object_table = 'comments';
    vote_object_id_property = 'comment_id';
  }

  return {
    vote_table: vote_table,
    object_table: object_table,
    vote_object_id_property: vote_object_id_property,
  };
}

async function vote(type: VoteType, req: Request, res: Response) {
  const { vote_table, object_table, vote_object_id_property } = getVoteConfig(
    type,
  );

  const { body, user }: any = req;

  const row = _.omit(
    {
      ...body,
      id: getId(),
      user_id: user.id,
    },
    ['sent_at'],
  );

  const existParams = _.omit(row, ['id', 'vote_type', 'sent_at']);

  console.log(existParams);

  const existQuery = pg
    .select('*')
    .from(vote_table)
    .where(existParams);

  console.log('exist query');
  console.log(existQuery.toSQL());
  const exists = await existQuery;

  let result;

  console.log(exists);
  if (!exists || _.isEmpty(exists)) {
    const insertVoteQuery = pg
      .insert(row)
      .into(vote_table)
      .returning('*');

    console.log('insert vote');
    console.log(insertVoteQuery.toSQL());

    result = await insertVoteQuery;

    let incQuery;
    if (row.vote_type === 'up_vote') {
      incQuery = pg.increment('up_votes', 1);
    } else {
      incQuery = pg.increment('down_votes', 1);
    }
    incQuery.into(object_table).where({ id: row[vote_object_id_property] });

    console.log('inc query');
    console.log(incQuery.toSQL());

    await incQuery;
  } else {
    const updateParams = _.omit(
      {
        ...row,
      },
      ['id'],
    );

    console.log('id: ');
    console.log(exists);

    const updateQuery = pg(vote_table)
      .update(updateParams)
      .where({ id: exists[0].id })
      .returning('*');
    console.log('update query:');
    console.log(updateQuery.toSQL());

    result = await updateQuery;
    console.log('result: ');
    console.log(result);

    const currentType = exists[0]['vote_type'];
    if (currentType !== row.vote_type) {
      let incQuery;
      let decQuery;
      if (row.vote_type == 'up_vote') {
        decQuery = pg.decrement('down_votes', 1);
        incQuery = pg.increment('up_votes', 1);
      } else {
        incQuery = pg.increment('down_votes', 1);
        decQuery = pg.decrement('up_votes', 1);
      }
      decQuery
        .into(object_table)
        .where({ id: updateParams[vote_object_id_property] });
      incQuery
        .into(object_table)
        .where({ id: updateParams[vote_object_id_property] });

      console.log('dec query');
      console.log(decQuery.toSQL());
      console.log('inc query');
      console.log(incQuery.toSQL());

      await decQuery;
      await incQuery;
    }
  }
  res.status(200).send({ result });
}

async function removeVote(type: VoteType, req: Request, res: Response) {
  const { vote_table, object_table, vote_object_id_property } = getVoteConfig(
    type,
  );

  const { body, user }: any = req;
  const row = _.omit(
    {
      ...body,
      id: getId(),
      user_id: user.id,
    },
    ['sent_at'],
  );

  const deleteParams = _.omit(row, ['sent_at']);

  const deleteQuery = pg
    .del()
    .from(vote_table)
    .where(deleteParams)
    .returning('*');

  console.log('delete query');
  console.log(deleteQuery.toSQL());
  const result = await deleteQuery;

  console.log('delete result:');
  console.log(result);

  const deleted = result[0];
  let incQuery;
  if (deleted.vote_type === 'up_vote') {
    incQuery = pg.decrement('up_votes', 1);
  } else {
    incQuery = pg.decrement('down_votes', 1);
  }
  incQuery.into(object_table).where({ id: row[vote_object_id_property] });

  console.log('inc query');
  console.log(incQuery.toSQL());

  await incQuery;

  res.status(200).send({ result });
}

async function getVotes(type: VoteType, req: Request, res: Response) {
  const { vote_table } = getVoteConfig(type);
  const result = await pg
    .select('*')
    .from(vote_table)
    .where(req);

  res.status(200).send({ result });
}

router.post('/api/comment_vote', requireAuth, async (req, res) => {
  await vote(VoteType.Comment, req, res);
});

router.get('/api/comment_vote', async (req, res) => {
  await getVotes(VoteType.Comment, req, res);
});

router.post('/api/question_vote', requireAuth, async (req, res) => {
  await vote(VoteType.Question, req, res);
});

router.get('/api/question_vote', async (req, res) => {
  await getVotes(VoteType.Question, req, res);
});

router.delete('/api/remove_question_vote', requireAuth, async (req, res) => {
  await removeVote(VoteType.Question, req, res);
});

router.delete('/api/remove_comment_vote', requireAuth, async (req, res) => {
  await removeVote(VoteType.Comment, req, res);
});
