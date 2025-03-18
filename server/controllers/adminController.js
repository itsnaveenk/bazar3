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

  const { team, date, result, announcement_time } = data; // renamed draw_time
  // validate if the team exists
  const teams = await db.query('SELECT id FROM teams WHERE name = ?', [team.toUpperCase()]);
  if (!teams.length) throw { status: 400, message: 'Team does not exist. Create team first.' };

  // publish result using team id
  await db.query(`
    INSERT INTO results (team_id, result_date, result, announcement_time)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      result = VALUES(result),
      announcement_time = VALUES(announcement_time)
  `, [teams[0].id, date, result, announcement_time]);
};
