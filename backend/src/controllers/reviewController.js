const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getByManga = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT r.*, u.username, u.avatar
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.manga_id = ?
      ORDER BY r.created_at DESC
    `, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { manga_id, rating, comment } = req.body;
    if (!manga_id || !rating) return res.status(400).json({ error: 'manga_id and rating required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const [existing] = await db.query(
      'SELECT id FROM reviews WHERE user_id = ? AND manga_id = ?',
      [req.user.id, manga_id]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: 'You already reviewed this manga' });

    const id = uuidv4();
    await db.query(
      'INSERT INTO reviews (id, user_id, manga_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, manga_id, rating, comment || '']
    );
    const [rows] = await db.query(
      'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.id = ?',
      [id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });

    await db.query(
      'UPDATE reviews SET rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?',
      [rating, comment, id]
    );
    const [updated] = await db.query(
      'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.id = ?',
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getByManga, getByUser, create, update, remove };
