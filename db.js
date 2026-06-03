const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const db = new Database(path.join(__dirname, "users.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

const defaultUsername = "admin";
const defaultPassword = "123456";

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(defaultUsername);
if (!existing) {
  const hash = bcrypt.hashSync(defaultPassword, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(defaultUsername, hash);
}

function verifyUser(username, password) {
  if (!username || !password) {
    return false;
  }

  const row = db.prepare("SELECT password FROM users WHERE username = ?").get(username);
  if (!row) {
    return false;
  }

  return bcrypt.compareSync(password, row.password);
}

module.exports = { verifyUser };
