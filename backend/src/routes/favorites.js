const express = require('express');
const router = express.Router();
const { getAll, toggle } = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAll);
router.post('/toggle', auth, toggle);

module.exports = router;
