import { router } from '../index';
import pg from '../pg';

router.get('/api/user', async (req, res) => {
  const { query } = req;
  const docs = await pg
    .select('*')
    .from('users')
    .where(query);

  res.status(200).send({ docs });
});
