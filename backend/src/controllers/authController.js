const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidUsername = (u) => /^[a-zA-Z0-9_-]{3,30}$/.test(u);

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Server misconfigured: JWT_SECRET missing');
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sanitize = (user) => {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
};

const register = async (req, res) => {
  try {
    let { username, email, password } = req.body || {};
    username = (username || '').trim();
    email = (email || '').trim().toLowerCase();

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are all required.' });
    }
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3–30 chars (letters, numbers, _ or -).' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    if (password.length > 200) {
      return res.status(400).json({ error: 'Password is too long.' });
    }

    const [existing] = await db.query(
      'SELECT id, email, username FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      const taken = existing[0].email === email ? 'email' : 'username';
      return res.status(409).json({ error: `This ${taken} is already taken.` });
    }

    const hash = await bcrypt.hash(password, 12);
    const id = uuidv4();
    await db.query(
      'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, username, email, hash, 'user']
    );

    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?',
      [id]
    );
    const user = rows[0];
    return res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already taken.' });
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
    }
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = (email || '').trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      // Don't reveal whether user exists
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    if (user.is_banned) {
      return res.status(403).json({ error: 'This account has been suspended.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const safe = sanitize(user);
    return res.json({ token: signToken(safe), user: safe });
  } catch (err) {
    console.error('Login error:', err);
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
    }
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, role, avatar, bio, created_at, is_banned FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    if (rows[0].is_banned) return res.status(403).json({ error: 'Account suspended.' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
};

module.exports = { register, login, me };
