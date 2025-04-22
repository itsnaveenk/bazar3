const db = require('../db');
const cache = require('../cache');
const { formatDate, getCurrentIndianDate } = require('../utils/dateHelpers');

exports.getResultsByTeamAndDate = async (team, date) => {
  console.log(`Fetching results for team: ${team}, date: ${date}`);
  try {
    const cacheKey = `${team}:${date}`;
    if (cache.has(cacheKey)) {
      console.log('Cache hit for results.');
      return cache.get(cacheKey);
    }

    const results = await db.query(`
      SELECT r.id, r.result_time,
        CASE
          WHEN CONVERT_TZ(NOW(), 'UTC', '+05:30') < r.result_time THEN '-1'
          ELSE r.result
        END AS visible_result,
        t.name AS team
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE t.name = ? AND DATE(r.result_time) = ?
      ORDER BY r.result_time DESC
    `, [team.toUpperCase(), date]);

    if (!results.length) {
      console.warn('No results found.');
      return [];
    }

    cache.set(cacheKey, results, 60000);
    return results;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw { status: 500, message: 'Internal Server Error' };
  }
};

exports.getTodayResults = async () => {
  const today = getCurrentIndianDate();
  const cacheKey = `today:${today}`;

  console.log(`Cache key: ${cacheKey}`);
  if (cache.has(cacheKey)) {
    console.log('Cache hit for today\'s results.');
    return cache.get(cacheKey);
  }

  console.log('Cache miss. Fetching results from the database...');
  const results = await db.query(`
    SELECT r.id, t.name AS team, r.result_time,
      CASE
        WHEN CONVERT_TZ(NOW(), 'UTC', '+05:30') < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE DATE(r.result_time) = CURDATE()
    ORDER BY r.result_time DESC
  `);

  console.log('Caching today\'s results...');
  cache.set(cacheKey, results, 60000);
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

  const cacheKey = `monthly:${team}:${month}`;
  if (cache.has(cacheKey)) {
    console.log('Cache hit for monthly results.');
    return cache.get(cacheKey);
  }

  const results = await db.query(`
    SELECT r.result_time,
      CASE
        WHEN CONVERT_TZ(NOW(), 'UTC', '+05:30') < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE t.name = ? AND DATE_FORMAT(r.result_time, '%Y-%m') = ?
    ORDER BY r.result_time DESC
  `, [team.toUpperCase(), month]);

  cache.set(cacheKey, results, 300000); // Cache for 5 minutes
  return results;
};

exports.getDailyResults = async (date) => {
  if (!date) {
    throw { status: 400, message: 'Date is required.' };
  }

  const cacheKey = `daily:${date}`;
  if (cache.has(cacheKey)) {
    console.log('Cache hit for daily results.');
    return cache.get(cacheKey);
  }

  // Use CONVERT_TZ to explicitly convert timestamps to IST
  const results = await db.query(`
    SELECT r.id, t.name AS team, r.result_time,
      CASE
        WHEN CONVERT_TZ(NOW(), 'UTC', '+05:30') < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE DATE(CONVERT_TZ(r.result_time, 'UTC', '+05:30')) = ?
    ORDER BY r.result_time DESC
  `, [date]);

  cache.set(cacheKey, results, 60000);
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
        WHEN CONVERT_TZ(NOW(), 'UTC', '+05:30') < r.result_time THEN '-1'
        ELSE r.result
      END AS visible_result,
      t.name AS team
    FROM results r
    JOIN teams t ON r.team_id = t.id
    WHERE t.name = ?
    ORDER BY r.result_time DESC
  `, [team.toUpperCase()]);

  cache.set(cacheKey, results, 60000);
  return results;
};

exports.clearCache = async () => {
  console.log('Manually clearing all cache...');
  cache.clear();
  return { success: true, message: 'Cache cleared successfully', timestamp: new Date().toISOString() };
};
