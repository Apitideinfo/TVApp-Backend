const express = require('express');
const { getPayments, getPayment, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getPayments);
router.get('/:id', auth, getPayment);
router.post('/', auth, createPayment);
router.put('/:id', auth, updatePayment);
router.delete('/:id', auth, deletePayment);

module.exports = router; 