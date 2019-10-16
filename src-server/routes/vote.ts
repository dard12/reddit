import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.post('/api/vote', requireAuth, async (req, res) => {
  const { vote, user } = req;
  // id - auto-inc leave out
  // user_id:  user.id
  // action: 'up_vote' or  'down_vote';
  // subject_id: <comment_id> | <repsonse_id> etc.
  // subject_type: 'comments' | 'questions's
  await pg.insert({}).from('votes');
  res.status(200).send();
});
