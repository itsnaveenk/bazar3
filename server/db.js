const mysql = require('mysql2/promise');

// Validate environment variables
const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  console.error(`[${new Date().toISOString()}] Missing environment variables: ${missingEnvs.join(', ')}`);
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  timezone: '+05:30', // Updated to Indian Standard Time (IST)
  ssl: { rejectUnauthorized: false } 
});

module.exports = {
  query: async (sql, params) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  }
};