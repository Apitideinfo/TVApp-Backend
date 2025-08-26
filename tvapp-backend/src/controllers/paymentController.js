const pool = require('../config/db');

exports.getPayments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  const { customer_id, amount, due_date, status } = req.body;
  try {
    await pool.query('INSERT INTO payments (customer_id, amount, due_date, status) VALUES (?, ?, ?, ?)', [customer_id, amount, due_date, status || 'pending']);
    res.status(201).json({ message: 'Payment created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  const { customer_id, amount, due_date, status } = req.body;
  try {
    await pool.query('UPDATE payments SET customer_id=?, amount=?, due_date=?, status=? WHERE id=?', [customer_id, amount, due_date, status, req.params.id]);
    res.json({ message: 'Payment updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await pool.query('DELETE FROM payments WHERE id=?', [req.params.id]);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 