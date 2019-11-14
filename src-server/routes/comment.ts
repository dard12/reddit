import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { execute, getId, upsert } from '../util';
import { CommentDoc } from '../models';

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
    author_id: user.id,
    author_name: user.user_name,
    up_votes: 0,
    down_votes: 0,
  };

  if (!parent_id) {
    body.parent_id = comment.id;
  }

  if (!is_edited) {
    comment.is_answer = type === 'response' && comment.id === comment.parent_id;
  }

  const docs = await upsert({ id }, comment, 'comments');
  const commentDoc: CommentDoc | undefined = _.first(docs);

  if (!is_edited && commentDoc) {
    await updateQuestion(commentDoc);
  }

  res.status(200).send({ docs });
});

async function updateQuestion(commentDoc: CommentDoc) {
  const {
    id: last_comment_id,
    type,
    question_id,
    created_at: last_commented_at,
  } = commentDoc;

  const targetCount = type === 'response' ? 'response_count' : 'meta_count';

  await pg('questions')
    .where({ id: question_id })
    .increment(targetCount, 1);

  await pg('questions')
    .where('last_commented_at', '<', last_commented_at)
    .where({ id: question_id })
    .update({ last_comment_id, last_commented_at });
}
