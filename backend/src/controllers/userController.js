const db = require('../config/database');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?',
      [req.params.id || req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const [[{ review_count }]] = await db.query('SELECT COUNT(*) AS review_count FROM reviews WHERE user_id = ?', [user.id]);
    const [[{ fav_count }]] = await db.query('SELECT COUNT(*) AS fav_count FROM favorites WHERE user_id = ?', [user.id]);

    res.json({ ...user, review_count, fav_count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar, password } = req.body;
    const updates = [];
    const params = [];

    if (username) { updates.push('username = ?'); params.push(username); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (avatar) { updates.push('avatar = ?'); params.push(avatar); }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
      updates.push('password_hash = ?');
      params.push(await bcrypt.hash(password, 12));
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    params.push(req.user.id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
