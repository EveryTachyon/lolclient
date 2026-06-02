const mysql = require("mysql2/promise");
const config = require("./config");

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
}

async function ping() {
  const p = getPool();
  const conn = await p.getConnection();
  conn.release();
  return true;
}

module.exports = { getPool, ping, config };
