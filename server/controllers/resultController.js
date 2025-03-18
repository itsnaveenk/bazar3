const db = require('../db');

exports.getMonthlyResults = async (req, res) => {
  try {
    const { team, month } = req.body;
    if (!team || !month) {
      return res.status(400).json({ error: 'Team and month are required.' });
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM.' });
    }
    const results = await db.query(`
      SELECT r.result, r.result_date, r.announcement_time
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE t.name = ? AND DATE_FORMAT(r.result_date, '%Y-%m') = ?
        AND (r.result_date < CURDATE()
          OR (r.result_date = CURDATE() AND r.announcement_time <= CURTIME()))
    `, [team.toUpperCase(), month]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for this team in the specified month.' });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDailyResults = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required.' });
    }
    const results = await db.query(`
      SELECT t.name as team, r.result, r.result_date, r.announcement_time
      FROM results r
      JOIN teams t ON r.team_id = t.id
      WHERE r.result_date = ?
        AND (r.result_date < CURDATE()
          OR (r.result_date = CURDATE() AND r.announcement_time <= CURTIME()))
    `, [date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for the specified date.' });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
