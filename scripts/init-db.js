// ============================================================================
// Database Initialization Script (scripts/init-db.js)
// Reads database.sql and initializes the MySQL database tables & sample data.
// Usage: node scripts/init-db.js
// ============================================================================

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load environment variables manually from .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...vals] = trimmed.split('=');
          if (key && vals.length) {
            process.env[key.trim()] = vals.join('=').trim();
          }
        }
      });
      break;
    }
  }
}

loadEnv();

async function initDatabase() {
  console.log('🚀 [CampusConnect] Starting MySQL Database Initialization...');

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'campus_connect';

  console.log(`Connecting to MySQL at ${host}:${port} as user "${user}"...`);

  let connection;
  try {
    // 1. Connect without database selected first (to create database if needed)
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });

    console.log('✅ Connected to MySQL server.');

    // 2. Read database.sql
    const sqlFilePath = path.join(__dirname, '..', 'database.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`database.sql file not found at: ${sqlFilePath}`);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log(`Executing database.sql against "${database}"...`);
    await connection.query(sqlContent);

    console.log('🎉 [Success] Database and tables created successfully with seed data!');
    console.log('Tables initialized: students, skills, services, requests');
    console.log('Ready to run the CampusConnect application via "npm run dev".');
  } catch (error) {
    console.error('❌ [Database Init Error]:', error.message);
    console.log('\nMake sure your MySQL server is running and credentials in .env.local or .env are correct.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();

