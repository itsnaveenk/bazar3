const express = require('express');
const router = express.Router();
const teamService = require('../services/teamService');

router.get('/', teamService.getAllTeams);

module.exports = router;
