const mysql = require('mysql2/promise');
const readline = require('readline');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function main() {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || await prompt('Enter MySQL username: ');
  const DB_PASS = process.env.DB_PASSWORD || await prompt('Enter MySQL password: ');
  const DB_NAME = process.env.DB_NAME || 'tv_db';

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME
    });
    console.log('Connected to MySQL.');

    // List of required tables
    const tables = [
      'users', 'customers', 'recharges', 'payments', 'notifications', 'admin_users', 'collections', 'admin_audit_logs'
    ];
    for (const table of tables) {
      const [rows] = await connection.query('SHOW TABLES LIKE ?', [table]);
      if (rows.length === 0) {
        console.error(`Table missing: ${table}`);
      } else {
        console.log(`Table exists: ${table}`);
      }
    }

    // Sample SELECT query
    const [users] = await connection.query('SELECT id, name, email FROM users LIMIT 1');
    console.log('Sample users:', users);

    await connection.end();
    console.log('DB test completed.');
  } catch (err) {
    console.error('DB connection/test failed:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

main();
