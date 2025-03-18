const express = require('express');
const router = express.Router();
const db = require('../db');
const cache = require('../cache');
const resultController = require('../controllers/resultController');

router.get('/results', async (req, res) => {
  try {
    const { team, date } = req.query;
    const cacheKey = `${team}:${date}`;
    
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const [result] = await db.query(`
      SELECT r.result, r.result_date, r.announcement_time, t.name AS team
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE t.name = ? AND r.result_date = ?
        AND (r.result_date < CURDATE()
          OR (r.result_date = CURDATE() AND r.announcement_time <= CURTIME()))
    `, [team.toUpperCase(), date]);

    if (!result) return res.status(404).json({ error: 'Result not found' });
    
    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `today:${today}`;

    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const results = await db.query(`
      SELECT t.name AS team, r.result, r.result_date, r.announcement_time
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE r.result_date = ?
        AND (r.result_date < CURDATE()
          OR (r.result_date = CURDATE() AND r.announcement_time <= CURTIME()))
    `, [today]);

    cache.set(cacheKey, results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// health check
router.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1'); // Simple query to check DB connection
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// (expects body: { team, month })
router.post('/results/monthly', resultController.getMonthlyResults);

// (expects query param: date=YYYY-MM-DD)
router.get('/results/daily', resultController.getDailyResults);

module.exports = router;