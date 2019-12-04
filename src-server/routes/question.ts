import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';
import { execute, getId } from '../util';

router.get('/api/question', async (req, res) => {
  const { query } = req;
  const { sort, search, upvoted_by, ...remaining } = query;
  const where = _.omit(remaining, ['page', 'pageSize']);

  const pgQuery = pg
    .select('*')
    .from('questions')
    .where(where);

  if (sort === 'top') {
    pgQuery
      .select(pg.raw('(up_votes + fake_up_votes - down_votes) as rank'))
      .orderBy('rank', 'desc')
      .orderBy('response_count', 'desc')
      .orderBy('id');
  } else if (sort === 'featured') {
    pgQuery.whereIn('id', ['klmay7msp9r7', 'kel4fl46b6da', 'yrj4dl3wrfsm']);
  } else if (sort === 'recent') {
    pgQuery
      .orderBy('last_commented_at', 'desc')
      .orderBy('created_at', 'desc')
      .orderBy('response_count', 'desc')
      .orderBy('id');
  } else if (sort) {
    pgQuery
      .orderBy(sort, 'desc')
      .orderBy('response_count', 'desc')
      .orderBy('id');
  }

  if (upvoted_by) {
    const upvoteResult = await pg
      .select('*')
      .from('question_votes')
      .where({ 'question_votes.user_id': upvoted_by, vote_type: 'up_vote' });
    const questionIds = _.map(upvoteResult, 'question_id');

    pgQuery.whereIn('id', questionIds);
  }

  if (search) {
    const searchDict = JSON.parse(query.search);
    const { tags, companies } = searchDict;
    const validTags = _.compact(_.pullAll(tags, ['all']));
    const validCompanies = _.compact(_.pullAll(companies, ['all']));

    if (!_.isEmpty(validTags)) {
      pgQuery.whereRaw('tags && ?', [validTags]);
    }

    if (!_.isEmpty(validCompanies)) {
      pgQuery.whereRaw('companies && ?', [validCompanies]);
    }

    if (searchDict.text) {
      const words: string[] = _.each(
        _.compact(searchDict.text.split(' ')),
        wrd => _.lowerCase(wrd),
      );
      if (words) {
        const terms = `%(${words.join(' | ')})%`;
        const likeSearch = `%${searchDict.text}%`;
        pgQuery.whereRaw(
          '(lower(title) similar to ? OR lower(description) similar to ?)',
          [terms, terms],
        );
        pgQuery.clearOrder();
        pgQuery.orderByRaw(
          ` coalesce(lower(title) LIKE ?, FALSE) DESC,
            coalesce(lower(description) LIKE ?, FALSE) DESC,
            like_count(lower(title), ?::varchar array) DESC,
            like_count(lower(description), ?::varchar array) DESC,
            id
           `,
          [likeSearch, likeSearch, words, words],
        );
      }
    }
  }

  const result = await execute(pgQuery, query);

  res.status(200).send(result);
});

router.post('/api/question', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { tags } = body;
  const docs = await pg
    .insert({
      ...body,
      id: getId(),
      author_id: user.id,
      response_count: 0,
      meta_count: 0,
      up_votes: 0,
      down_votes: 0,
    })
    .into('questions')
    .returning('*');

  res.status(200).send({ docs });

  _.each(tags, async tag => {
    await pg.raw(
      `
        INSERT INTO tags (id)
        VALUES (?)
        ON CONFLICT (id)
        DO UPDATE
        SET count = tags.count + 1
        `,
      [tag],
    );
  });
});
