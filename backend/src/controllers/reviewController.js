const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const handleError = (res, err, context = '') => {
  console.error(`${context} error:`, err);
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ error: 'Database unavailable.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
};

const getByManga = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Manga ID required.' });
    const [rows] = await db.query(`
      SELECT r.*, u.username, u.avatar
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.manga_id = ?
      ORDER BY r.created_at DESC
    `, [id]);
    res.json(rows);
  } catch (err) {
    handleError(res, err, 'getByManga');
  }
};

const getByUser = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, m.title AS manga_title, m.cover_url
      FROM reviews r
      JOIN manga m ON m.id = r.manga_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    handleError(res, err, 'getByUser');
  }
};

const create = async (req, res) => {
  try {
    const { manga_id, rating, comment } = req.body || {};
    if (!manga_id) return res.status(400).json({ error: 'Manga ID is required.' });
    const r = parseInt(rating);
    if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    if (comment && comment.length > 5000) return res.status(400).json({ error: 'Comment too long (max 5000 chars).' });

    const [mangaExists] = await db.query('SELECT id FROM manga WHERE id = ?', [manga_id]);
    if (mangaExists.length === 0) return res.status(404).json({ error: 'Manga not found.' });

    const [existing] = await db.query(
      'SELECT id FROM reviews WHERE user_id = ? AND manga_id = ?',
      [req.user.id, manga_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'You already reviewed this manga. Edit your existing review instead.' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO reviews (id, user_id, manga_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, manga_id, r, (comment || '').trim()]
    );
    const [rows] = await db.query(
      'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.id = ?',
      [id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    handleError(res, err, 'create review');
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body || {};
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Review not found.' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only edit your own reviews.' });
    }
    let r = null;
    if (rating != null) {
      r = parseInt(rating);
      if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (comment != null && comment.length > 5000) return res.status(400).json({ error: 'Comment too long.' });

    await db.query(
      'UPDATE reviews SET rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?',
      [r, comment != null ? String(comment).trim() : null, id]
    );
    const [updated] = await db.query(
      'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.id = ?',
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    handleError(res, err, 'update review');
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Review not found.' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own reviews.' });
    }
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted', id });
  } catch (err) {
    handleError(res, err, 'delete review');
  }
};

module.exports = { getByManga, getByUser, create, update, remove };
