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
      const words: string[] = _.each(
        _.compact(searchDict.text.split(' ')),
        wrd => _.lowerCase(wrd),
      );
      if (words) {
        const terms = `%(${words.join(' | ')})%`;
        const likeSearch = '%' + searchDict.text + '%';
        pgQuery.whereRaw(
          '(lower(title) similar to ? OR lower(description) similar to ?)',
          [terms, terms],
        );
        pgQuery.clearOrder();
        pgQuery.orderByRaw(
          ` coalesce(lower(title) LIKE ?, FALSE) DESC,
            coalesce(lower(description) LIKE ?, FALSE) DESC,
            like_count(lower(title), ?::varchar array) DESC,
            like_count(lower(description), ?::varchar array) DESC
           `,
          [likeSearch, likeSearch, words, words],
        );
      }
    }
  }
  console.log(pgQuery.toSQL());
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
