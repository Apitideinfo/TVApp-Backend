const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Middleware to verify admin authentication
exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token contains admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Verify admin exists in database
    const [adminRows] = await pool.query(
      'SELECT id, admin_id, username FROM admin_users WHERE id = ?',
      [decoded.id]
    );

    if (!adminRows.length) {
      return res.status(403).json({ message: 'Access denied. Admin not found.' });
    }

    req.admin = adminRows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

// Middleware to check if admin exists (for setup endpoint)
exports.checkAdminExists = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    req.adminExists = rows[0].count > 0;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database error checking admin existence.' });
  }
};

// Middleware to log admin actions
exports.logAdminAction = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log successful admin actions
    if (res.statusCode < 400 && req.admin) {
      const action = `${req.method} ${req.originalUrl}`;
      const details = {
        method: req.method,
        url: req.originalUrl,
        body: req.method !== 'GET' ? req.body : undefined,
        query: req.query,
        timestamp: new Date().toISOString()
      };

      // Async logging (don't wait for it)
      pool.query(
        'INSERT INTO admin_audit_logs (admin_id, action, details) VALUES (?, ?, ?)',
        [req.admin.id, action, JSON.stringify(details)]
      ).catch(err => console.error('Audit log error:', err));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};
