const express = require('express');
const router = express.Router();
const { getAll, getOne, getTrending, getFeatured, create, update, remove, getGenres } = require('../controllers/mangaController');
const { auth, optionalAuth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/genres', getGenres);
router.get('/trending', optionalAuth, getTrending);
router.get('/featured', getFeatured);
router.get('/', optionalAuth, getAll);
router.get('/:id', optionalAuth, getOne);
router.post('/', auth, admin, create);
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
