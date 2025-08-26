const express = require('express');
const { getRecharges, getRecharge, createRecharge, updateRecharge, deleteRecharge } = require('../controllers/rechargeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getRecharges);
router.get('/:id', auth, getRecharge);
router.post('/', auth, createRecharge);
router.put('/:id', auth, updateRecharge);
router.delete('/:id', auth, deleteRecharge);

module.exports = router; 