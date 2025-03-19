const db = require('../db');
const cache = require('../cache');

exports.getResultsByTeamAndDate = async (team, date) => {
  console.log(`Fetching results for team: ${team}, date: ${date}`);
  try {
    const cacheKey = `${team}:${date}`;
    if (cache.has(cacheKey)) {
      console.log('Cache hit for results.');
      return cache.get(cacheKey);
    }

    const results = await db.query(`
      SELECT r.result_time,
        CASE
          WHEN NOW() < r.result_time THEN '-1'
          ELSE r.result
        END AS visible_result,
        t.name AS team
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE t.name = ? AND DATE(r.result_time) = ?
    `, [team.toUpperCase(), date]);

    if (!results.length) {
      console.warn('No results found.');
      return [];
    }

    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw { status: 500, message: 'Internal Server Error' };
  }
};

exports.getTodayResults = async () => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `today:${today}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const results = await db.query(`
    SELECT t.name AS team, r.result_time,
      CASE
        WHEN NOW() < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE DATE(r.result_time) = ?
  `, [today]);

  cache.set(cacheKey, results);
  return results;
};

exports.checkHealth = async () => {
  try {
    await db.query('SELECT 1'); // Simple query to check DB connection
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

exports.getMonthlyResults = async (team, month) => {
  if (!team || !month) {
    throw { status: 400, message: 'Team and month are required.' };
  }
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw { status: 400, message: 'Invalid month format. Use YYYY-MM.' };
  }

  const results = await db.query(`
    SELECT r.result_time,
      CASE
        WHEN NOW() < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE t.name = ? AND DATE_FORMAT(r.result_time, '%Y-%m') = ?
  `, [team.toUpperCase(), month]);

  return results;
};

exports.getDailyResults = async (date) => {
  if (!date) {
    throw { status: 400, message: 'Date is required.' };
  }

  const results = await db.query(`
    SELECT t.name AS team, r.result_time,
      CASE
        WHEN NOW() < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE DATE(r.result_time) = ?
  `, [date]);

  return results;
};

exports.getResultsByTeam = async (team) => {
  if (!team) {
    throw { status: 400, message: 'Team query parameter is required.' };
  }

  const cacheKey = `team:${team}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const results = await db.query(`
    SELECT r.result_time,
      CASE
        WHEN NOW() < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result,
      t.name AS team
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE t.name = ?
  `, [team.toUpperCase()]);

  cache.set(cacheKey, results);
  return results;
};
