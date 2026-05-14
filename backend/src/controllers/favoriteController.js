const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

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
    res.status(500).json({ error: err.message });
  }
};

const toggle = async (req, res) => {
  try {
    const { manga_id } = req.body;
    if (!manga_id) return res.status(400).json({ error: 'manga_id required' });

    const [existing] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND manga_id = ?',
      [req.user.id, manga_id]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM favorites WHERE user_id = ? AND manga_id = ?', [req.user.id, manga_id]);
      res.json({ favorited: false });
    } else {
      await db.query(
        'INSERT INTO favorites (id, user_id, manga_id) VALUES (?, ?, ?)',
        [uuidv4(), req.user.id, manga_id]
      );
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, toggle };
