const db = require('../config/database');

const getStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_manga }]] = await db.query('SELECT COUNT(*) AS total_manga FROM manga');
    const [[{ total_reviews }]] = await db.query('SELECT COUNT(*) AS total_reviews FROM reviews');
    const [[{ total_favorites }]] = await db.query('SELECT COUNT(*) AS total_favorites FROM favorites');

    const [recentUsers] = await db.query(
      'SELECT id, username, email, role, created_at, is_banned FROM users ORDER BY created_at DESC LIMIT 10'
    );
    const [recentManga] = await db.query(
      'SELECT id, title, author, status, created_at FROM manga ORDER BY created_at DESC LIMIT 10'
    );
    const [topManga] = await db.query(`
      SELECT m.id, m.title, m.cover_url, COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(DISTINCT f.id) AS fav_count
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      GROUP BY m.id ORDER BY fav_count DESC LIMIT 5
    `);

    res.json({ total_users, total_manga, total_reviews, total_favorites, recentUsers, recentManga, topManga });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = '';
    let params = [];
    if (search) { where = 'WHERE username LIKE ? OR email LIKE ?'; params = [`%${search}%`, `%${search}%`]; }

    const [rows] = await db.query(
      `SELECT id, username, email, role, avatar, created_at, is_banned FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);
    res.json({ users: rows, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ error: 'Cannot ban yourself' });
    const [rows] = await db.query('SELECT is_banned FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const newBan = rows[0].is_banned ? 0 : 1;
    await db.query('UPDATE users SET is_banned = ? WHERE id = ?', [newBan, id]);
    res.json({ is_banned: Boolean(newBan) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const newRole = rows[0].role === 'admin' ? 'user' : 'admin';
    await db.query('UPDATE users SET role = ? WHERE id = ?', [newRole, id]);
    res.json({ role: newRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats, getUsers, banUser, promoteUser, deleteReview };
