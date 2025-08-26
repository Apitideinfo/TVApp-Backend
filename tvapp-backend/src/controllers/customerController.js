const pool = require('../config/db');

exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, email, phone, balance } = req.body;
  try {
    await pool.query('INSERT INTO customers (name, email, phone, balance) VALUES (?, ?, ?, ?)', [name, email, phone, balance || 0]);
    res.status(201).json({ message: 'Customer created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { name, email, phone, balance } = req.body;
  try {
    await pool.query('UPDATE customers SET name=?, email=?, phone=?, balance=? WHERE id=?', [name, email, phone, balance, req.params.id]);
    res.json({ message: 'Customer updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await pool.query('DELETE FROM customers WHERE id=?', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 