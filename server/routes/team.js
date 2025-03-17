const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { validateTeam } = require('../middlewares/validation');

// Get all teams
router.get('/', teamController.getAllTeams);

// Create a new team
router.post('/', validateTeam, teamController.createTeam);

// Update a team
router.put('/:id', validateTeam, teamController.updateTeam);

// Delete a team
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
