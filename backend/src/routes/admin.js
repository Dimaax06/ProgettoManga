const express = require('express');
const router = express.Router();
const { getStats, getUsers, banUser, promoteUser, deleteReview } = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/promote', promoteUser);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
