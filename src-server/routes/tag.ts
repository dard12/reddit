import { router } from '../index';
import pg from '../pg';

router.get('/api/tag', async (req, res) => {
  const docs = await pg.select('*').from('tags');

  res.status(200).send({ docs });
});
