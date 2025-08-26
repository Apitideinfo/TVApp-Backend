# Database Setup Guide

This guide will help you set up and test the MySQL database for the backend.

## 1. Create Database and Tables

### Windows
Run the following in a terminal (from the `db-setup` folder):
```sh
db.bat
```
Or, provide username and password as arguments:
```sh
db.bat root mypassword
```

### Linux/Mac
Run the following in a terminal (from the `db-setup` folder):
```sh
chmod +x db.sh
./db.sh
```

You will be prompted for your MySQL username and password if not provided as environment variables.

## 2. Test Database Connection

After running the setup script, test the connection and table creation:
```sh
node dbTest.js
```
This script will:
- Connect to the `tv_db` database
- Check if all required tables exist
- Run a sample SELECT query on the `users` table

## 3. Backend Database Connection

The backend connects to the database using the following environment variables (set in `.env` in `tvapp-backend`):
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=tv_db
```

- The backend uses `mysql2` and a connection pool (see `src/config/db.js`).
- Make sure the `.env` file is present and filled out before starting the backend.

## Troubleshooting
- If you get connection errors, check your MySQL server is running and credentials are correct.
- If tables are missing, re-run the setup script.
- If you change the schema, re-run the setup script to update tables.

## Files
- `schema.sql` — MySQL schema for all tables
- `db.bat` / `db.sh` — Setup scripts for Windows/Linux/Mac
- `dbTest.js` — Node.js script to test DB connection and tables
