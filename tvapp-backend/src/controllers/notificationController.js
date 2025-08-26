const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Notification not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotification = async (req, res) => {
  const { message } = req.body;
  try {
    await pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [req.user.id, message]);
    res.status(201).json({ message: 'Notification created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNotification = async (req, res) => {
  const { message, read } = req.body;
  try {
    await pool.query('UPDATE notifications SET message=?, read=? WHERE id=? AND user_id=?', [message, read, req.params.id, req.user.id]);
    res.json({ message: 'Notification updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 