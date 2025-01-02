// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Point the database file to "/app/data/finance.db"
const dbPath = path.resolve(__dirname, 'data', 'finance.db');
const db = new sqlite3.Database(dbPath);

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS incomes (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         source TEXT,
                                         amount REAL,
                                         assignedTo TEXT,
                                         category TEXT,
                                         month TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          description TEXT,
                                          amount REAL,
                                          dueDate TEXT,
                                          assignedTo TEXT,
                                          category TEXT,
                                          month TEXT
    );
  `);
});

module.exports = db;
