import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import getId from '../utility';
import execute from '../execute';

router.get('/api/question', async (req, res) => {
  const { query } = req;
  const { sort, search } = query;
  const where = _.omit(query, ['search', 'sort', 'page', 'pageSize']);

  const pgQuery = pg
    .select('*')
    .from('questions')
    .where(where);

  if (sort === 'recent') {
    pgQuery
      .orderBy('updated_at', 'desc')
      .orderBy('created_at', 'desc')
      .orderBy('response_count', 'desc');
  } else if (sort) {
    pgQuery.orderBy(sort, 'desc').orderBy('response_count', 'desc');
  }

  if (search) {
    const searchDict = JSON.parse(query.search);
    const { tags } = searchDict;
    const validTags = _.compact(_.pullAll(tags, ['all']));

    if (!_.isEmpty(validTags)) {
      pgQuery.whereRaw('tags && ?', [validTags]);
    }

    if (searchDict.text) {
      const words: string[] = _.compact(searchDict.text.split(' '));
      if (words) {
        const terms = `%(${words.join(' | ')})%`;
        pgQuery.whereRaw('(title similar to ? OR description similar to ?)', [
          terms,
          terms,
        ]);
        pgQuery.clearOrder();
        pgQuery.orderByRaw(
          ` title LIKE '%${searchDict.text}% DESC',
             description LIKE '%${searchDict.text}% DESC',
            like_count(title, ?::varchar array) DESC,
            like_count(description, ?::varchar array) DESC`,
          [words, words],
        );
      }
    }
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/question', requireAuth, async (req, res) => {
  const { body, user } = req;
  const docs = await pg
    .insert({
      ...body,
      id: getId(),
      author_id: user.id,
      response_count: 0,
      meta_count: 0,
      up_vote: 0,
      down_vote: 0,
    })
    .into('questions')
    .returning('*');

  res.status(200).send({ docs });
});
