import knex from 'knex';

const pg = knex({
  client: 'pg',
  connection: {
    database: process.env.PG_DB_NAME,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_USER_PASSWORD,
  },
});

export default pg;
