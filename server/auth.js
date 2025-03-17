const argon2 = require('argon2');
const speakeasy = require('speakeasy');

// Generate Admin Credentials
const createAdmin = async (password) => {
  const accessKey = crypto.randomBytes(16).toString('hex');
  const hash = await argon2.hash(password);
  const totpSecret = speakeasy.generateSecret({ length: 20 });
  
  return {
    accessKey,
    hash,
    totpSecret: totpSecret.base32
  };
};

// Verify Admin Login
const verifyAdmin = async (accessKey, password, token) => {
  // 1. Fetch admin from DB
  const { rows: [admin] } = await db.query(
    'SELECT * FROM admins WHERE access_key = $1',
    [accessKey]
  );

  // 2. Verify password
  if (!admin || !await argon2.verify(admin.argon2_hash, password)) {
    return false;
  }

  // 3. Verify TOTP
  return speakeasy.totp.verify({
    secret: admin.totp_secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

module.exports = { createAdmin, verifyAdmin };