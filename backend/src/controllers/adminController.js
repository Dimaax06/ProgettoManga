const db = require('../config/database');

const handleError = (res, err, context = '') => {
  console.error(`${context} error:`, err);
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ error: 'Database unavailable.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
};

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
      SELECT m.id, m.title, m.cover_url,
             COALESCE(AVG(r.rating), 0) AS avg_rating,
             COUNT(DISTINCT f.id) AS fav_count
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      GROUP BY m.id
      ORDER BY fav_count DESC, avg_rating DESC
      LIMIT 5
    `);

    res.json({
      total_users: Number(total_users) || 0,
      total_manga: Number(total_manga) || 0,
      total_reviews: Number(total_reviews) || 0,
      total_favorites: Number(total_favorites) || 0,
      recentUsers, recentManga, topManga,
    });
  } catch (err) {
    handleError(res, err, 'getStats');
  }
};

const getUsers = async (req, res) => {
  try {
    let { page = 1, limit = 20, search } = req.query;
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (page - 1) * limit;

    let where = '';
    let params = [];
    if (search) {
      where = 'WHERE username LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    const [rows] = await db.query(
      `SELECT id, username, email, role, avatar, created_at, is_banned FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);
    res.json({ users: rows, total: Number(total) || 0 });
  } catch (err) {
    handleError(res, err, 'getUsers');
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ error: 'You cannot ban yourself.' });
    const [rows] = await db.query('SELECT is_banned, role FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    if (rows[0].role === 'admin') return res.status(403).json({ error: 'Cannot ban another admin.' });
    const newBan = rows[0].is_banned ? 0 : 1;
    await db.query('UPDATE users SET is_banned = ? WHERE id = ?', [newBan, id]);
    res.json({ is_banned: Boolean(newBan) });
  } catch (err) {
    handleError(res, err, 'banUser');
  }
};

const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ error: 'You cannot change your own role.' });
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    const newRole = rows[0].role === 'admin' ? 'user' : 'admin';
    await db.query('UPDATE users SET role = ? WHERE id = ?', [newRole, id]);
    res.json({ role: newRole });
  } catch (err) {
    handleError(res, err, 'promoteUser');
  }
};

const deleteReview = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM reviews WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Review not found.' });
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted', id: req.params.id });
  } catch (err) {
    handleError(res, err, 'deleteReview');
  }
};

module.exports = { getStats, getUsers, banUser, promoteUser, deleteReview };
