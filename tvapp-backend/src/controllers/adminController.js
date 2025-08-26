const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Return current admin profile from auth middleware
exports.getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ admin: req.admin });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile.', error: error.message });
  }
};

// Admin Setup - First time admin creation
exports.setupAdmin = async (req, res) => {
  try {
    if (req.adminExists) {
      return res.status(400).json({ message: 'Admin already exists. Only one admin is allowed.' });
    }

    const { admin_id, username, password } = req.body;

    if (!admin_id || !username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      'INSERT INTO admin_users (admin_id, username, password) VALUES (?, ?, ?)',
      [admin_id, username, hashedPassword]
    );

    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Admin ID or username already exists.' });
    }
    res.status(500).json({ message: 'Error creating admin.', error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;

    if (!admin_id || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required.' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE admin_id = ?',
      [admin_id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, admin_id: admin.admin_id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        admin_id: admin.admin_id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error.', error: error.message });
  }
};

// Check if admin exists
exports.checkAdminExists = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    res.json({ adminExists: rows[0].count > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Database error.', error: error.message });
  }
};

// Get Dashboard Analytics
exports.getDashboard = async (req, res) => {
  try {
    // Get total collections
    const [collectionsData] = await pool.query(`
      SELECT 
        COUNT(*) as total_collections,
        SUM(amount) as total_amount,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_collections,
        COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_collections
      FROM collections
    `);

    // Get worker count and performance
    const [workersData] = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_workers,
        COUNT(DISTINCT c.worker_id) as active_workers
      FROM users u
      LEFT JOIN collections c ON u.id = c.worker_id
      WHERE u.role = 'worker'
    `);

    // Get customer count
    const [customersData] = await pool.query(`
      SELECT COUNT(*) as total_customers
      FROM users WHERE role = 'client'
    `);

    // Get recent collections
    const [recentCollections] = await pool.query(`
      SELECT 
        c.id,
        c.amount,
        c.collection_date,
        c.status,
        u.name as worker_name,
        cu.name as customer_name
      FROM collections c
      LEFT JOIN users u ON c.worker_id = u.id
      LEFT JOIN users cu ON c.customer_id = cu.id
      ORDER BY c.collection_date DESC
      LIMIT 10
    `);

    // Get monthly revenue trend
    const [monthlyRevenue] = await pool.query(`
      SELECT 
        DATE_FORMAT(collection_date, '%Y-%m') as month,
        SUM(amount) as revenue,
        COUNT(*) as collections_count
      FROM collections
      WHERE collection_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(collection_date, '%Y-%m')
      ORDER BY month DESC
    `);

    res.json({
      collections: collectionsData[0],
      workers: workersData[0],
      customers: customersData[0],
      recentCollections,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data.', error: error.message });
  }
};

// Get All Collections with Filters
exports.getCollections = async (req, res) => {
  try {
    const { 
      worker_id, 
      status, 
      start_date, 
      end_date, 
      min_amount, 
      max_amount,
      page = 1,
      limit = 20,
      sort_by = 'collection_date',
      sort_order = 'DESC'
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (worker_id) {
      whereClause += ' AND c.worker_id = ?';
      queryParams.push(worker_id);
    }

    if (status) {
      whereClause += ' AND c.status = ?';
      queryParams.push(status);
    }

    if (start_date) {
      whereClause += ' AND c.collection_date >= ?';
      queryParams.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND c.collection_date <= ?';
      queryParams.push(end_date);
    }

    if (min_amount) {
      whereClause += ' AND c.amount >= ?';
      queryParams.push(min_amount);
    }

    if (max_amount) {
      whereClause += ' AND c.amount <= ?';
      queryParams.push(max_amount);
    }

    const offset = (page - 1) * limit;
    const validSortColumns = ['collection_date', 'amount', 'status', 'worker_name'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'collection_date';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const query = `
      SELECT 
        c.*,
        u.name as worker_name,
        cu.name as customer_name,
        p.verified_by_admin,
        p.admin_notes
      FROM collections c
      LEFT JOIN users u ON c.worker_id = u.id
      LEFT JOIN users cu ON c.customer_id = cu.id
      LEFT JOIN payments p ON c.id = p.collection_id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const [collections] = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM collections c
      ${whereClause}
    `;

    const [countResult] = await pool.query(countQuery, queryParams.slice(0, -2));

    res.json({
      collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections.', error: error.message });
  }
};

// Get All Workers with Performance Metrics
exports.getWorkers = async (req, res) => {
  try {
    const [workers] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        COUNT(c.id) as total_collections,
        SUM(c.amount) as total_amount,
        COUNT(CASE WHEN c.status = 'verified' THEN 1 END) as verified_collections,
        COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_collections,
        AVG(c.amount) as avg_collection_amount,
        MAX(c.collection_date) as last_collection_date
      FROM users u
      LEFT JOIN collections c ON u.id = c.worker_id
      WHERE u.role = 'worker'
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY total_amount DESC
    `);

    res.json({ workers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers.', error: error.message });
  }
};

// Get All Customers with Filtering
exports.getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    let whereClause = "WHERE u.role = 'client'";
    const queryParams = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const offset = (page - 1) * limit;

    const [customers] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        COUNT(c.id) as total_collections,
        SUM(c.amount) as total_paid,
        MAX(c.collection_date) as last_payment_date
      FROM users u
      LEFT JOIN collections c ON u.id = c.customer_id
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY u.name
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), offset]);

    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `, queryParams);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers.', error: error.message });
  }
};

// Get All Payments for Verification
exports.getPayments = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (status === 'verified') {
      whereClause += ' AND p.verified_by_admin = TRUE';
    } else if (status === 'pending') {
      whereClause += ' AND p.verified_by_admin = FALSE';
    }

    const offset = (page - 1) * limit;

    const [payments] = await pool.query(`
      SELECT 
        p.*,
        c.amount as collection_amount,
        c.collection_date,
        c.status as status,
        u.name as worker_name,
        cu.name as customer_name
      FROM payments p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN users u ON c.worker_id = u.id
      LEFT JOIN users cu ON c.customer_id = cu.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), offset]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM payments p
      ${whereClause}
    `, queryParams);

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments.', error: error.message });
  }
};

// Verify/Reject Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body; // status: 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "verified" or "rejected".' });
    }

    const verified = status === 'verified';

    await pool.query(`
      UPDATE payments 
      SET verified_by_admin = ?, admin_notes = ?, verified_at = NOW(), verified_by_admin_id = ?
      WHERE id = ?
    `, [verified, admin_notes || null, req.admin.id, id]);

    // Also update the collection status
    await pool.query(`
      UPDATE collections c
      JOIN payments p ON c.id = p.collection_id
      SET c.status = ?
      WHERE p.id = ?
    `, [status, id]);

    res.json({ message: `Payment ${status} successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment.', error: error.message });
  }
};

// Generate Reports
exports.getReports = async (req, res) => {
  try {
    const { 
      report_type = 'collections',
      start_date,
      end_date,
      worker_id 
    } = req.query;

    let dateFilter = '';
    const queryParams = [];

    if (start_date && end_date) {
      dateFilter = 'AND collection_date BETWEEN ? AND ?';
      queryParams.push(start_date, end_date);
    }

    let workerFilter = '';
    if (worker_id) {
      workerFilter = 'AND worker_id = ?';
      queryParams.push(worker_id);
    }

    let reportData = {};

    if (report_type === 'collections') {
      const [collections] = await pool.query(`
        SELECT 
          DATE(collection_date) as date,
          COUNT(*) as total_collections,
          SUM(amount) as total_amount,
          COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_count,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM collections
        WHERE 1=1 ${dateFilter} ${workerFilter}
        GROUP BY DATE(collection_date)
        ORDER BY date DESC
      `, queryParams);

      reportData = { collections };
    } else if (report_type === 'workers') {
      const [workerPerformance] = await pool.query(`
        SELECT 
          u.name as worker_name,
          COUNT(c.id) as total_collections,
          SUM(c.amount) as total_amount,
          AVG(c.amount) as avg_amount,
          COUNT(CASE WHEN c.status = 'verified' THEN 1 END) as verified_collections
        FROM users u
        LEFT JOIN collections c ON u.id = c.worker_id
        WHERE u.role = 'worker' ${dateFilter.replace('collection_date', 'c.collection_date')} ${workerFilter.replace('worker_id', 'c.worker_id')}
        GROUP BY u.id, u.name
        ORDER BY total_amount DESC
      `, queryParams);

      reportData = { workerPerformance };
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating reports.', error: error.message });
  }
};

// Get Real-time Analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Today's collections
    const [todayStats] = await pool.query(`
      SELECT 
        COUNT(*) as today_collections,
        SUM(amount) as today_amount
      FROM collections
      WHERE DATE(collection_date) = CURDATE()
    `);

    // This week's collections
    const [weekStats] = await pool.query(`
      SELECT 
        COUNT(*) as week_collections,
        SUM(amount) as week_amount
      FROM collections
      WHERE collection_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // Top performing workers this month
    const [topWorkers] = await pool.query(`
      SELECT 
        u.name,
        COUNT(c.id) as collections_count,
        SUM(c.amount) as total_amount
      FROM users u
      JOIN collections c ON u.id = c.worker_id
      WHERE c.collection_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY u.id, u.name
      ORDER BY total_amount DESC
      LIMIT 5
    `);

    // Collection status distribution
    const [statusDistribution] = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as amount
      FROM collections
      GROUP BY status
    `);

    res.json({
      todayStats: todayStats[0],
      weekStats: weekStats[0],
      topWorkers,
      statusDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics.', error: error.message });
  }
};

// Export reports as CSV
exports.exportReports = async (req, res) => {
  try {
    const { report_type = 'collections', start_date, end_date, worker_id } = req.query;

    // Reuse getReports logic to obtain data
    req.query.report_type = report_type;
    const result = {};
    let rows = [];

    if (report_type === 'collections') {
      const [collections] = await pool.query(`
        SELECT 
          DATE(collection_date) as date,
          COUNT(*) as total_collections,
          SUM(amount) as total_amount,
          COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_count,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM collections
        WHERE 1=1 ${start_date && end_date ? 'AND collection_date BETWEEN ? AND ?' : ''} ${worker_id ? 'AND worker_id = ?' : ''}
        GROUP BY DATE(collection_date)
        ORDER BY date DESC
      `, [
        ...(start_date && end_date ? [start_date, end_date] : []),
        ...(worker_id ? [worker_id] : [])
      ]);
      rows = collections;
    } else if (report_type === 'workers') {
      const [workerPerformance] = await pool.query(`
        SELECT 
          u.name as worker_name,
          COUNT(c.id) as total_collections,
          SUM(c.amount) as total_amount,
          AVG(c.amount) as avg_amount,
          COUNT(CASE WHEN c.status = 'verified' THEN 1 END) as verified_collections
        FROM users u
        LEFT JOIN collections c ON u.id = c.worker_id
        WHERE u.role = 'worker' ${start_date && end_date ? 'AND c.collection_date BETWEEN ? AND ?' : ''} ${worker_id ? 'AND c.worker_id = ?' : ''}
        GROUP BY u.id, u.name
        ORDER BY total_amount DESC
      `, [
        ...(start_date && end_date ? [start_date, end_date] : []),
        ...(worker_id ? [worker_id] : [])
      ]);
      rows = workerPerformance;
    }

    // Build CSV
    if (!rows || rows.length === 0) {
      return res.status(200).type('text/csv').send('No data');
    }

    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
    res.setHeader('Content-Disposition', `attachment; filename="${report_type}_report.csv"`);
    res.setHeader('Content-Type', 'text/csv');
    return res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting report.', error: error.message });
  }
};
