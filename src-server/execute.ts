import { QueryBuilder } from 'knex';
import _ from 'lodash';

export default async function execute(pgQuery: QueryBuilder, options?: any) {
  const page = _.toNumber(_.get(options, 'page')) || 0;
  const pageSize = _.toNumber(_.get(options, 'pageSize')) || 5;
  const tempDocs = await pgQuery
    .clone()
    .limit(pageSize + 1)
    .offset(pageSize * page);

  const next = _.size(tempDocs) > pageSize ? page + 1 : null;
  const docs = _.take(tempDocs, pageSize);

  return { docs, page, next };
}
