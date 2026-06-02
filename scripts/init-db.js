const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const config = require("../db/config");

function readSql(fileName) {
  return fs.readFileSync(path.join(__dirname, "..", "database", fileName), "utf8");
}

function splitStatements(sql) {
  return sql
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

async function run() {
  const rootConn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await rootConn.query(`USE \`${config.database}\``);

  for (const statement of splitStatements(readSql("schema.sql"))) {
    await rootConn.query(statement);
  }

  await rootConn.query("SET FOREIGN_KEY_CHECKS = 0");
  const tables = ["friends", "ranks", "rune_pages", "match_history", "champions", "summoners"];
  for (const table of tables) {
    await rootConn.query(`TRUNCATE TABLE ${table}`);
  }
  await rootConn.query("SET FOREIGN_KEY_CHECKS = 1");

  for (const statement of splitStatements(readSql("seed.sql"))) {
    await rootConn.query(statement);
  }

  await rootConn.end();
  console.log(`MySQL database "${config.database}" initialized successfully.`);
}

run().catch((error) => {
  console.error("Database init failed:", error.message);
  process.exit(1);
});
