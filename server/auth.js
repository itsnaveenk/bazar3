const argon2 = require('argon2');
const crypto = require('crypto');

// Generate Admin Credentials
const createAdmin = async (password) => {
  const accessKey = crypto.randomBytes(16).toString('hex');
  const hash = await argon2.hash(password);
  
  return { accessKey, hash };
};

// Verify Admin Login
const verifyAdmin = async (accessKey, password) => {
  const admins = await db.query(
    'SELECT * FROM admins WHERE access_key = ?',
    [accessKey]
  );
  const admin = admins[0];
  if (!admin || !await argon2.verify(admin.argon2_hash, password)) {
    return false;
  }
  return true;
};

module.exports = { createAdmin, verifyAdmin };