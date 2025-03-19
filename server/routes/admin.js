const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { validateResult } = require('../middlewares/validation');
const { authorizeAdmin } = require('../middlewares/authorization');

router.post('/login', async (req, res, next) => {
  try {
    const { accessKey, password } = req.body;
    const token = await adminService.login(accessKey, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/results', authorizeAdmin, validateResult, async (req, res, next) => {
  try {
    await adminService.publishResult(req.body);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.put('/results/:id', authorizeAdmin, validateResult, async (req, res, next) => {
  try {
    await adminService.updateResultById(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/results/:id', authorizeAdmin, async (req, res, next) => {
  try {
    await adminService.deleteResultById(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/results', authorizeAdmin, async (req, res, next) => {
  try {
    const data = await adminService.getResultsByTeam(req.query.team);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/teams', authorizeAdmin, async (req, res, next) => {
  try {
    const result = await adminService.createTeam(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/teams/:id', authorizeAdmin, async (req, res, next) => {
  try {
    const result = await adminService.updateTeam(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/teams/:id', authorizeAdmin, async (req, res, next) => {
  try {
    const result = await adminService.deleteTeam(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;