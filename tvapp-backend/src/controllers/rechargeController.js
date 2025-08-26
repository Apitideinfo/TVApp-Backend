const pool = require('../config/db');

exports.getRecharges = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM recharges');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecharge = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM recharges WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Recharge not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRecharge = async (req, res) => {
  const { customer_id, amount } = req.body;
  try {
    await pool.query('INSERT INTO recharges (customer_id, amount) VALUES (?, ?)', [customer_id, amount]);
    // Update customer balance
    await pool.query('UPDATE customers SET balance = balance + ? WHERE id = ?', [amount, customer_id]);
    res.status(201).json({ message: 'Recharge created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRecharge = async (req, res) => {
  const { customer_id, amount } = req.body;
  try {
    await pool.query('UPDATE recharges SET customer_id=?, amount=? WHERE id=?', [customer_id, amount, req.params.id]);
    res.json({ message: 'Recharge updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecharge = async (req, res) => {
  try {
    await pool.query('DELETE FROM recharges WHERE id=?', [req.params.id]);
    res.json({ message: 'Recharge deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 