const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const adminController = require('../controllers/adminController');
const { verifyAdmin, checkAdminExists, logAdminAction } = require('../middleware/adminAuth');

// Public routes (no authentication required)
router.get('/check-exists', adminController.checkAdminExists);
router.post(
  '/setup',
  checkAdminExists,
  [
    body('admin_id').isString().trim().notEmpty(),
    body('username').isString().trim().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  },
  adminController.setupAdmin
);
router.post(
  '/login',
  [body('admin_id').isString().trim().notEmpty(), body('password').isString().isLength({ min: 8 })],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  },
  adminController.loginAdmin
);

// Protected admin routes (authentication required)
router.use(verifyAdmin); // All routes below require admin authentication
router.use(logAdminAction); // Log all admin actions

// Profile
router.get('/me', adminController.getMe);

// Dashboard and Analytics
router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', adminController.getAnalytics);

// Collections Management
router.get('/collections', adminController.getCollections);

// Worker Management
router.get('/workers', adminController.getWorkers);

// Customer Management
router.get('/customers', adminController.getCustomers);

// Payment Management
router.get('/payments', adminController.getPayments);
router.put(
  '/verify-payment/:id',
  [param('id').isInt(), body('status').isIn(['verified', 'rejected']), body('admin_notes').optional().isString()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  },
  adminController.verifyPayment
);

// Reports
router.get('/reports', adminController.getReports);
router.get('/reports/export', adminController.exportReports);

module.exports = router;
