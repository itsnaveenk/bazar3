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

exports.createTeam = async (req, res) => {
  try {
    const { name, announcement_time } = req.body;

    if (!name || !announcement_time) {
      return res.status(400).json({ error: 'Name and announcement time are required' });
    }

    await db.query(
      'INSERT INTO teams (name, announcement_time) VALUES (?, ?)',
      [name.toUpperCase(), announcement_time]
    );

    res.status(201).json({ success: true, message: 'Team created successfully' });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, announcement_time } = req.body;

    if (!name && !announcement_time) {
      return res.status(400).json({ error: 'At least one field (name or announcement time) is required' });
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name.toUpperCase());
    }

    if (announcement_time) {
      fields.push('announcement_time = ?');
      values.push(announcement_time);
    }

    values.push(id);

    await db.query(`UPDATE teams SET ${fields.join(', ')} WHERE id = ?`, values);

    res.json({ success: true, message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM teams WHERE id = ?', [id]);

    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
};
