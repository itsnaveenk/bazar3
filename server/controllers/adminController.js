const db = require('../db');
const crypto = require('crypto');
const argon2 = require('argon2');

exports.login = async (accessKey, password) => {
  const [admin] = await db.query(
    'SELECT * FROM admins WHERE access_key = ? AND is_active = 1',
    [accessKey]
  );

  if (!admin) throw { status: 401, message: 'Invalid credentials' };

  const validPass = await argon2.verify(admin.argon2_hash, password);
  if (!validPass) throw { status: 401, message: 'Invalid password' };

  const sessionToken = crypto.randomBytes(32).toString('hex');
  await db.query(
    'UPDATE admins SET session_token = ?, last_access = NOW() WHERE id = ?',
    [sessionToken, admin.id]
  );

  return sessionToken;
};

exports.publishResult = async (data, authorization) => {
  const token = authorization?.split(' ')[1];
  const [admin] = await db.query('SELECT id FROM admins WHERE session_token = ?', [token]);

  if (!admin) throw { status: 401, message: 'Unauthorized' };

  const { team, date, result } = data;
  await db.query(`
    INSERT INTO results (team_id, result_date, result)
    SELECT id, ?, ? FROM teams WHERE name = ?
    ON DUPLICATE KEY UPDATE result = VALUES(result)
  `, [date, result, team.toUpperCase()]);
};
