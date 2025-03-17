require('dotenv').config();
const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../db');

(async () => {
  try {
    const accessKey = crypto.randomBytes(16).toString('hex');
    const password = process.argv[2];
    if (!password) {
      console.error('Usage: node scripts/create-admin.js <password>');
      process.exit(1);
    }
    const hash = await argon2.hash(password);

    await db.query(
      `INSERT INTO admins (access_key, argon2_hash) VALUES (?, ?)`,
      [accessKey, hash]
    );

    console.log('Admin created successfully!');
    console.log(`Access Key: ${accessKey}`);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
})();
