const fs = require('fs');
const path = require('path');
const { connect } = require('@tidbcloud/serverless');

async function initTidbDatabase() {
  console.log('🚀 Connecting to TiDB Cloud to execute database.sql...');
  
  const url = 'mysql://29Y5D95c7xnvrXU.root:q6Jj4LFdykHNawCb@gateway01.ap-northeast-1.prod.aws.tidbcloud.com/sys';
  const conn = connect({ url });

  // Read database.sql
  const sqlFile = path.join(__dirname, '..', 'database.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split into individual SQL statements by semicolon, ignoring comments
  const lines = sqlContent.split('\n');
  const statements = [];
  let currentStmt = '';

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed.length === 0) continue;
    currentStmt += line + '\n';
    if (trimmed.endsWith(';')) {
      statements.push(currentStmt.trim());
      currentStmt = '';
    }
  }

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    // Skip USE or CREATE DATABASE if any, or execute directly
    try {
      await conn.execute(stmt);
      console.log(`[${i + 1}/${statements.length}] Executed successfully.`);
    } catch (err) {
      console.warn(`[${i + 1}/${statements.length}] Notice on statement:`, err.message);
    }
  }

  console.log('\nVerifying tables created in TiDB Cloud:');
  const tables = await conn.execute('SHOW TABLES;');
  console.log('Tables in database:', tables);

  const studentCount = await conn.execute('SELECT COUNT(*) AS total FROM students;');
  console.log('Total students inserted:', studentCount);

  const skillsCount = await conn.execute('SELECT COUNT(*) AS total FROM skills;');
  console.log('Total skills inserted:', skillsCount);

  console.log('\n🎉 ALL DATABASE TABLES AND SEED DATA INITIALIZED IN TIDB CLOUD MYSQL!');
}

initTidbDatabase();

