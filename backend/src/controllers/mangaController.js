const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const validStatuses = ['ongoing', 'completed', 'hiatus', 'cancelled'];
const validSorts = {
  created_at: 'm.created_at',
  rating: 'avg_rating',
  favorites: 'fav_count',
  title: 'm.title',
};

const handleError = (res, err, context = '') => {
  console.error(`${context} error:`, err);
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
};

const getAll = async (req, res) => {
  try {
    let { page = 1, limit = 20, sort = 'created_at', order = 'DESC', genre, search, status } = req.query;

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (page - 1) * limit;
    const userId = req.user?.id || null;

    const where = [];
    const params = [];

    if (genre) { where.push('JSON_CONTAINS(m.genres, JSON_QUOTE(?))'); params.push(String(genre)); }
    if (status && validStatuses.includes(status)) { where.push('m.status = ?'); params.push(status); }
    if (search) { where.push('(m.title LIKE ? OR m.author LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sortCol = validSorts[sort] || 'm.created_at';
    const sortOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

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

    const queryParams = userId
      ? [userId, ...params, limit, offset]
      : [...params, limit, offset];

    const [rows] = await db.query(query, queryParams);

    const countQuery = `SELECT COUNT(DISTINCT m.id) AS total FROM manga m ${whereClause}`;
    const [[{ total }]] = await db.query(countQuery, params);

    res.json({
      manga: rows,
      total: Number(total) || 0,
      page,
      limit,
      pages: Math.max(1, Math.ceil((Number(total) || 0) / limit)),
    });
  } catch (err) {
    handleError(res, err, 'getAll');
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Manga ID required.' });
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

    if (rows.length === 0) return res.status(404).json({ error: 'Manga not found.' });
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err, 'getOne');
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
    handleError(res, err, 'getTrending');
  }
};

const getFeatured = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count,
        COUNT(DISTINCT f.id) AS fav_count
      FROM manga m
      LEFT JOIN reviews r ON r.manga_id = m.id
      LEFT JOIN favorites f ON f.manga_id = m.id
      WHERE m.is_featured = 1
      GROUP BY m.id
      ORDER BY RAND()
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    handleError(res, err, 'getFeatured');
  }
};

const create = async (req, res) => {
  try {
    const { title, author, description, cover_url, genres, status, chapters, year } = req.body || {};
    if (!title || !author) return res.status(400).json({ error: 'Title and author are required.' });
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const id = uuidv4();
    const safeGenres = Array.isArray(genres) ? genres : [];
    const safeChapters = parseInt(chapters) || 0;
    const safeYear = parseInt(year) || new Date().getFullYear();

    await db.query(
      'INSERT INTO manga (id, title, author, description, cover_url, genres, status, chapters, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title.trim(), author.trim(), description || '', cover_url || '', JSON.stringify(safeGenres),
       status || 'ongoing', safeChapters, safeYear]
    );
    const [rows] = await db.query('SELECT * FROM manga WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    handleError(res, err, 'create manga');
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, cover_url, genres, status, chapters, year, is_featured } = req.body || {};
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const [existing] = await db.query('SELECT id FROM manga WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Manga not found.' });

    await db.query(
      `UPDATE manga SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        description = COALESCE(?, description),
        cover_url = COALESCE(?, cover_url),
        genres = COALESCE(?, genres),
        status = COALESCE(?, status),
        chapters = COALESCE(?, chapters),
        year = COALESCE(?, year),
        is_featured = COALESCE(?, is_featured)
       WHERE id = ?`,
      [title, author, description, cover_url,
       genres ? JSON.stringify(Array.isArray(genres) ? genres : []) : null,
       status, chapters != null ? parseInt(chapters) : null,
       year != null ? parseInt(year) : null,
       is_featured != null ? (is_featured ? 1 : 0) : null,
       id]
    );
    const [rows] = await db.query('SELECT * FROM manga WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err, 'update manga');
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM manga WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Manga not found.' });
    await db.query('DELETE FROM manga WHERE id = ?', [id]);
    res.json({ message: 'Manga deleted', id });
  } catch (err) {
    handleError(res, err, 'delete manga');
  }
};

const getGenres = async (req, res) => {
  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Psychological', 'Romance', 'Sci-Fi', 'Seinen', 'Shonen', 'Shoujo', 'Slice of Life',
    'Sports', 'Supernatural', 'Thriller', 'Historical'];
  res.json(genres);
};

module.exports = { getAll, getOne, getTrending, getFeatured, create, update, remove, getGenres };
