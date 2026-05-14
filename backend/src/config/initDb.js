const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Auto-initializes the database: creates DB if missing, runs schema + seed.
// Idempotent: safe to run on every startup.
async function initializeDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };
  const dbName = process.env.DB_NAME || 'dimangax';

  let conn;
  try {
    // 1. Connect without DB to create it if missing
    conn = await mysql.createConnection(config);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    // 2. Run schema (CREATE TABLE IF NOT EXISTS — idempotent)
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8')
        .split('\n')
        .filter(line => !line.match(/^\s*CREATE\s+DATABASE/i) && !line.match(/^\s*USE\s+/i))
        .join('\n');
      await conn.query(schema);
    }

    // 3. Check if manga table is empty → run seed
    const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM manga');
    if (count === 0) {
      const seedPath = path.join(__dirname, '../../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seed = fs.readFileSync(seedPath, 'utf8')
          .split('\n')
          .filter(line => !line.match(/^\s*USE\s+/i))
          .join('\n');
        await conn.query(seed);
        console.log('✅ Seed data loaded (15 manga + demo accounts)');
      }
    } else {
      console.log(`✅ Database has ${count} manga already`);
    }

    // 4. Always ensure demo accounts exist with correct role + password (idempotent upsert)
    const adminHash = '$2a$12$gf4BTWCwQ.tMDMxpbiC24uX64X9OPhqMDHCY/bRenP8fDaAZJzSQm';
    const demoHash = '$2a$12$EIACPFj9GBw1GoMoZ44Q/uHmTQciqZE35uBSj2cdfYZL9ohZ2XFs2';
    await conn.query(
      `INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin', is_banned = 0`,
      ['admin-uuid-0001', 'DiMangaX_Admin', 'admin@dimangax.com', adminHash]
    );
    await conn.query(
      `INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, 'user')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_banned = 0`,
      ['user-uuid-0001', 'OtakuPrime', 'demo@dimangax.com', demoHash]
    );
    console.log('✅ Demo accounts verified (admin@dimangax.com / demo@dimangax.com)');

    return true;
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    console.error('   Make sure MySQL is running and credentials in .env are correct.');
    return false;
  } finally {
    if (conn) await conn.end();
  }
}

module.exports = { initializeDatabase };
