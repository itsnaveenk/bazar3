const db = require('../db');

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await db.query('SELECT * FROM teams');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};
