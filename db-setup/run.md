# Backend Setup & Run Guide (Windows + VS Code)

Follow these steps to set up and run the backend with all database tables created automatically.

---

## 1. Prerequisites
- **Node.js** (v16+ recommended)
- **MySQL Server** (running locally or accessible remotely)
- **VS Code** (with terminal access)

---

## 2. Clone or Copy the Project
Open VS Code and clone/copy the project folder to your system.

---

## 3. Install Backend Dependencies
Open a terminal in the `tvapp-backend` folder and run:
```sh
npm install
```

---

## 4. Configure Environment Variables
1. Copy `.env.example` to `.env` in `tvapp-backend` (if not already present).
2. Edit `.env` and set your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=tv_db
   ```

---

## 5. Set Up the Database (Create All Tables)
1. Open a terminal in the `db-setup` folder.
2. Run the setup script:
   ```sh
   db.bat
   ```
   - Enter your MySQL username and password when prompted.
   - This will create the `tv_db` database and all required tables.

---

## 6. Test the Database Setup
Run the test script to verify tables:
```sh
node dbTest.js
```
- This will check all tables and run a sample query.
- If you see errors, check your MySQL credentials and rerun the setup.

---

## 7. Start the Backend Server
In the `tvapp-backend` folder, run:
```sh
npm run dev
```
- The backend should start on the configured port (default: 5000).

---

## 8. Test the Backend with an API Client
You can use **Postman**, **Thunder Client** (VS Code extension), or **curl** to test the backend.

### Example: Register a User
POST to `http://localhost:5000/api/users/register`
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpassword"
}
```

### Example: Login
POST to `http://localhost:5000/api/users/login`
```json
{
  "email": "test@example.com",
  "password": "testpassword"
}
```

If you get a token and user info, your backend and database are working!

---

## 9. Troubleshooting
- If you get DB connection errors, check your `.env` and MySQL server.
- If tables are missing, rerun `db.bat`.
- If backend fails to start, check terminal output for errors.

---

**You are now ready to develop and test your backend!**
