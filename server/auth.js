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
  const { rows: [admin] } = await db.query(
    'SELECT * FROM admins WHERE access_key = $1',
    [accessKey]
  );
  if (!admin || !await argon2.verify(admin.argon2_hash, password)) {
    return false;
  }
  return speakeasy.totp.verify({
    secret: admin.totp_secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

module.exports = { createAdmin, verifyAdmin };