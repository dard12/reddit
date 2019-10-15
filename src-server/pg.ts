import knex from 'knex';

const pg = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

export default pg;
