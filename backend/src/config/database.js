const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dimangax',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

let connected = false;
pool.getConnection()
  .then(conn => {
    console.log('✅ Database pool connected');
    connected = true;
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Check that MySQL is running and DB_USER/DB_PASSWORD/DB_NAME in .env are correct.');
  });

pool.isConnected = () => connected;

module.exports = pool;
