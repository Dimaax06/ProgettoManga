require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('🔥 Setting up DiMangaX database...');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await conn.query(schema);
  console.log('✅ Schema created');

  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  await conn.query(seed);
  console.log('✅ Seed data inserted');

  await conn.end();
  console.log('\n🎉 Database setup complete!\n   Admin: admin@dimangax.com / admin123\n   Demo:  demo@dimangax.com  / demo123\n');
}

setup().catch(err => { console.error('❌', err.message); process.exit(1); });
