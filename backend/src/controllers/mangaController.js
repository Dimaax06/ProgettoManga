const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'created_at', order = 'DESC', genre, search, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.user?.id || null;

    let where = [];
    let params = [];

    if (genre) { where.push('JSON_CONTAINS(m.genres, JSON_QUOTE(?))'); params.push(genre); }
    if (status) { where.push('m.status = ?'); params.push(status); }
    if (search) { where.push('(m.title LIKE ? OR m.author LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const validSorts = { created_at: 'm.created_at', rating: 'avg_rating', favorites: 'fav_count', title: 'm.title' };
    const sortCol = validSorts[sort] || 'm.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const query = `
      SELECT m.*,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT f.id) AS fav_count
        ${userId ? ', MAX(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END) AS is_favorited' : ', 0 AS is_favorited'}
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      ${whereClause}
      GROUP BY m.id
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const queryParams = userId ? [userId, ...params, parseInt(limit), offset] : [...params, parseInt(limit), offset];
    const [rows] = await db.query(query, queryParams);

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT m.id) AS total FROM manga m ${whereClause}`,
      params
    );

    res.json({ manga: rows, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const [rows] = await db.query(`
      SELECT m.*,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT f.id) AS fav_count
        ${userId ? ', MAX(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END) AS is_favorited' : ', 0 AS is_favorited'}
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      WHERE m.id = ?
      GROUP BY m.id
    `, userId ? [userId, id] : [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Manga not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTrending = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const [rows] = await db.query(`
      SELECT m.*,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT f.id) AS fav_count
        ${userId ? ', MAX(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END) AS is_favorited' : ', 0 AS is_favorited'}
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      GROUP BY m.id
      ORDER BY fav_count DESC, avg_rating DESC
      LIMIT 10
    `, userId ? [userId] : []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM manga WHERE is_featured = 1 ORDER BY RAND() LIMIT 5'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, author, description, cover_url, genres, status, chapters, year } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });
    const id = uuidv4();
    await db.query(
      'INSERT INTO manga (id, title, author, description, cover_url, genres, status, chapters, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, author, description || '', cover_url || '', JSON.stringify(genres || []), status || 'ongoing', chapters || 0, year || new Date().getFullYear()]
    );
    const [rows] = await db.query('SELECT * FROM manga WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, cover_url, genres, status, chapters, year, is_featured } = req.body;
    await db.query(
      `UPDATE manga SET title=COALESCE(?,title), author=COALESCE(?,author), description=COALESCE(?,description),
       cover_url=COALESCE(?,cover_url), genres=COALESCE(?,genres), status=COALESCE(?,status),
       chapters=COALESCE(?,chapters), year=COALESCE(?,year), is_featured=COALESCE(?,is_featured) WHERE id=?`,
      [title, author, description, cover_url, genres ? JSON.stringify(genres) : null, status, chapters, year, is_featured, id]
    );
    const [rows] = await db.query('SELECT * FROM manga WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await db.query('DELETE FROM manga WHERE id = ?', [req.params.id]);
    res.json({ message: 'Manga deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Seinen', 'Shonen', 'Shoujo', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, getTrending, getFeatured, create, update, remove, getGenres };
