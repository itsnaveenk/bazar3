const db = require('../db');

exports.getAllTeams = async (req, res) => {
  console.log('Fetching all teams...');
  try {
    const teams = await db.query('SELECT * FROM teams');
    if (!teams.length) {
      console.log('No teams found.');
      return res.status(200).json({ error: 'No teams found.' });
    }
    console.log(`Fetched ${teams.length} teams.`);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};
