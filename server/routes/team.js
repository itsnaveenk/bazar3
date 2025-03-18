const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { validateTeam } = require('../middlewares/validation');
const db = require('../db');

async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const [admin] = await db.query('SELECT id FROM admins WHERE session_token = ?', [token]);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

router.get('/', teamController.getAllTeams);

router.post('/', requireAdmin, validateTeam, teamController.createTeam);

router.put('/:id', requireAdmin, validateTeam, teamController.updateTeam);

router.delete('/:id', requireAdmin, teamController.deleteTeam);

module.exports = router;
