import { Router } from 'express';
import { pool } from '../config/db.js';
import { runImport } from '../services/importFromWikis.js';

const router = Router();

router.get('/', async (req, res) => {
  const search = (req.query.search || '').trim();
  const tribe = (req.query.tribe || '').trim();
  const rank = (req.query.rank || '').trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(60, Math.max(1, Number(req.query.pageSize || 24)));
  const offset = (page - 1) * pageSize;

  const filters = [];
  const params = [];

  if (search) {
    filters.push('(name LIKE ? OR description_text LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (tribe) {
    filters.push('tribe = ?');
    params.push(tribe);
  }
  if (rank) {
    filters.push('rank_code = ?');
    params.push(rank);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT id, slug, name, tribe, rank_code AS rankCode, medal_number AS medalNumber, description_text AS descriptionText, image_url AS imageUrl, medal_image_url AS medalImageUrl, wiki_url AS wikiUrl
     FROM yokai
     ${where}
     ORDER BY name ASC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM yokai ${where}`, params);

  res.json({
    data: rows,
    pagination: {
      page,
      pageSize,
      total: Number(countRows[0]?.total || 0)
    }
  });
});

router.get('/tribes', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT tribe, COUNT(*) AS count
     FROM yokai
     WHERE tribe IS NOT NULL AND tribe <> ''
     GROUP BY tribe
     ORDER BY count DESC, tribe ASC`
  );
  res.json(rows);
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const [rows] = await pool.query(
    `SELECT id, slug, name, tribe, rank_code AS rankCode, medal_number AS medalNumber, description_text AS descriptionText, image_url AS imageUrl, medal_image_url AS medalImageUrl, wiki_url AS wikiUrl, metadata_json AS metadataJson
     FROM yokai
     WHERE slug = ?
     LIMIT 1`,
    [slug]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'Yo-kai introuvable.' });
  }

  return res.json(rows[0]);
});

router.post('/admin/import', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!process.env.ADMIN_IMPORT_TOKEN || token !== process.env.ADMIN_IMPORT_TOKEN) {
    return res.status(401).json({ message: 'Token admin invalide.' });
  }

  const limit = Math.min(1200, Math.max(1, Number(req.query.limit || 400)));
  const result = await runImport({ limit });
  return res.json({ message: 'Import terminé.', ...result });
});

export default router;
