const db = require('../config/database');
const bcrypt = require('bcryptjs');

const isValidUsername = (u) => /^[a-zA-Z0-9_-]{3,30}$/.test(u);

const handleError = (res, err, context = '') => {
  console.error(`${context} error:`, err);
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ error: 'Database unavailable.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });

    const user = rows[0];
    const [[{ review_count }]] = await db.query('SELECT COUNT(*) AS review_count FROM reviews WHERE user_id = ?', [user.id]);
    const [[{ fav_count }]] = await db.query('SELECT COUNT(*) AS fav_count FROM favorites WHERE user_id = ?', [user.id]);

    res.json({ ...user, review_count, fav_count });
  } catch (err) {
    handleError(res, err, 'getProfile');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar, password } = req.body || {};
    const updates = [];
    const params = [];

    if (username != null) {
      const u = String(username).trim();
      if (!isValidUsername(u)) {
        return res.status(400).json({ error: 'Username must be 3–30 chars (letters, numbers, _ or -).' });
      }
      // Check if username taken by someone else
      const [existing] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [u, req.user.id]);
      if (existing.length > 0) return res.status(409).json({ error: 'Username already taken.' });
      updates.push('username = ?');
      params.push(u);
    }
    if (bio != null) {
      if (String(bio).length > 1000) return res.status(400).json({ error: 'Bio too long (max 1000 chars).' });
      updates.push('bio = ?');
      params.push(String(bio));
    }
    if (avatar != null) {
      if (String(avatar).length > 500) return res.status(400).json({ error: 'Avatar URL too long.' });
      updates.push('avatar = ?');
      params.push(String(avatar));
    }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      if (password.length > 200) return res.status(400).json({ error: 'Password too long.' });
      updates.push('password_hash = ?');
      params.push(await bcrypt.hash(password, 12));
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update.' });
    params.push(req.user.id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err, 'updateProfile');
  }
};

module.exports = { getProfile, updateProfile };
