const express = require('express');
const { getNotifications, getNotification, createNotification, updateNotification, deleteNotification } = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getNotifications);
router.get('/:id', auth, getNotification);
router.post('/', auth, createNotification);
router.put('/:id', auth, updateNotification);
router.delete('/:id', auth, deleteNotification);

module.exports = router; 