const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { validateTeam } = require('../middlewares/validation');

router.get('/', teamController.getAllTeams);

router.post('/', validateTeam, teamController.createTeam);

router.put('/:id', validateTeam, teamController.updateTeam);

router.delete('/:id', teamController.deleteTeam);

module.exports = router;
