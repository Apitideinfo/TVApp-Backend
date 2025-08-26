-- Admin Panel Database Migration Script
-- Run this script to set up admin functionality

-- Create admin_users table (single admin constraint)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add unique constraint to ensure only one admin
ALTER TABLE admin_users ADD CONSTRAINT single_admin_constraint UNIQUE (id);

-- Update existing users table to include role
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'worker', 'client') DEFAULT 'user';

-- Update payments table for admin verification
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_by_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_by_admin_id INT;

-- Create collections tracking table
CREATE TABLE IF NOT EXISTS collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  worker_id INT,
  customer_id INT,
  amount DECIMAL(10,2) NOT NULL,
  collection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create admin_audit_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,
  action VARCHAR(100) NOT NULL,
  target_table VARCHAR(50),
  target_id INT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Insert default admin (uncomment and modify as needed)
-- INSERT INTO admin_users (admin_id, username, password) 
-- VALUES ('ADMIN001', 'superadmin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
-- Note: The above password is 'password' - change it immediately after setup

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collections_worker_id ON collections(worker_id);
CREATE INDEX IF NOT EXISTS idx_collections_customer_id ON collections(customer_id);
CREATE INDEX IF NOT EXISTS idx_collections_date ON collections(collection_date);
CREATE INDEX IF NOT EXISTS idx_collections_status ON collections(status);
CREATE INDEX IF NOT EXISTS idx_payments_verified ON payments(verified_by_admin);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
