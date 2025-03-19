const db = require('../db');
const crypto = require('crypto');
const argon2 = require('argon2');

exports.login = async (accessKey, password) => {
  console.log(`Admin login attempt with accessKey: ${accessKey}`);
  try {
    const [admin] = await db.query(
      'SELECT * FROM admins WHERE access_key = ? AND is_active = 1',
      [accessKey]
    );

    if (!admin) {
      console.warn('Invalid accessKey.');
      throw { status: 401, message: 'Invalid credentials' };
    }

    const validPass = await argon2.verify(admin.argon2_hash, password);
    if (!validPass) {
      console.warn('Invalid password.');
      throw { status: 401, message: 'Invalid password' };
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    await db.query(
      'UPDATE admins SET session_token = ?, last_access = NOW() WHERE id = ?',
      [sessionToken, admin.id]
    );

    console.log('Admin login successful.');
    return sessionToken;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

exports.publishResult = async (data) => {
  const { team, result, result_time } = data;
  const teams = await db.query('SELECT id FROM teams WHERE name = ?', [team.toUpperCase()]);
  if (!teams.length) throw { status: 400, message: 'Team does not exist. Create team first.' };

  await db.query(`
    INSERT INTO results (team_id, result, result_time)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      result = VALUES(result),
      result_time = VALUES(result_time)
  `, [teams[0].id, result, result_time]);
};

exports.getResultsByTeam = async (teamName) => {
  if (!teamName) throw { status: 400, message: 'Team name is required' };

  return db.query(`
    SELECT r.*, t.name AS team_name
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE t.name = ?
  `, [teamName.toUpperCase()]);
};

exports.createTeam = async (data) => {
  const { name } = data;
  if (!name) throw { status: 400, message: 'Name is required' };
  await db.query('INSERT INTO teams (name) VALUES (?)', [name.toUpperCase()]);
  return { success: true, message: 'Team created successfully' };
};

exports.updateTeam = async (id, data) => {
  const { name } = data;
  if (!name) throw { status: 400, message: 'Name is required' };
  await db.query('UPDATE teams SET name = ? WHERE id = ?', [name.toUpperCase(), id]);
  return { success: true, message: 'Team updated successfully' };
};

exports.deleteTeam = async (id) => {
  await db.query('DELETE FROM teams WHERE id = ?', [id]);
  return { success: true, message: 'Team deleted successfully' };
};

exports.updateResultById = async (id, data) => {
  const { team, result, result_time } = data;
  const teams = await db.query('SELECT id FROM teams WHERE name = ?', [team.toUpperCase()]);
  if (!teams.length) throw { status: 400, message: 'Team does not exist' };

  await db.query(
    'UPDATE results SET team_id = ?, result = ?, result_time = ? WHERE id = ?',
    [teams[0].id, result, result_time, id]
  );
};

exports.deleteResultById = async (id) => {
  await db.query('DELETE FROM results WHERE id = ?', [id]);
};
