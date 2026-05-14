const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const handleError = (res, err, context = '') => {
  console.error(`${context} error:`, err);
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ error: 'Database unavailable.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
};

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, f.created_at AS favorited_at,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        1 AS is_favorited
      FROM favorites f
      JOIN manga m ON m.id = f.manga_id
      LEFT JOIN reviews r ON r.manga_id = m.id
      WHERE f.user_id = ?
      GROUP BY m.id, f.created_at
      ORDER BY f.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    handleError(res, err, 'getAll favorites');
  }
};

const toggle = async (req, res) => {
  try {
    const { manga_id } = req.body || {};
    if (!manga_id) return res.status(400).json({ error: 'Manga ID required.' });

    const [mangaExists] = await db.query('SELECT id FROM manga WHERE id = ?', [manga_id]);
    if (mangaExists.length === 0) return res.status(404).json({ error: 'Manga not found.' });

    const [existing] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND manga_id = ?',
      [req.user.id, manga_id]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM favorites WHERE user_id = ? AND manga_id = ?', [req.user.id, manga_id]);
      return res.json({ favorited: false });
    }

    await db.query(
      'INSERT INTO favorites (id, user_id, manga_id) VALUES (?, ?, ?)',
      [uuidv4(), req.user.id, manga_id]
    );
    return res.json({ favorited: true });
  } catch (err) {
    handleError(res, err, 'toggle favorite');
  }
};

module.exports = { getAll, toggle };
