const express = require('express');
const router = express.Router();
const resultService = require('../services/resultService');
const { validateDate, validateMonthlyResults } = require('../middlewares/validation');

router.get('/results', async (req, res, next) => {
  try {
    const { team, date } = req.query;
    const results = await resultService.getResultsByTeamAndDate(team, date);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/today', async (req, res, next) => {
  try {
    const results = await resultService.getTodayResults();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/health', async (req, res, next) => {
  try {
    const healthStatus = await resultService.checkHealth();
    res.json(healthStatus);
  } catch (error) {
    next(error);
  }
});

router.post('/results/monthly', validateMonthlyResults, async (req, res, next) => {
  try {
    const { team, month } = req.body;
    const results = await resultService.getMonthlyResults(team, month);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/results/daily', validateDate, async (req, res, next) => {
  try {
    const { date } = req.query;
    const results = await resultService.getDailyResults(date);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/results/team', async (req, res, next) => {
  try {
    const { team } = req.query;
    const results = await resultService.getResultsByTeam(team);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;