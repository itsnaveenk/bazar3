const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateResult } = require('../middlewares/validation');

router.post('/login', async (req, res, next) => {
  try {
    const { accessKey, password } = req.body;
    const token = await adminController.login(accessKey, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/results', validateResult, async (req, res, next) => {
  try {
    await adminController.publishResult(req.body, req.headers.authorization);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.put('/results/:id', validateResult, async (req, res, next) => {
  try {
    await adminController.updateResultById(req.params.id, req.body, req.headers.authorization);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/results/:id', async (req, res, next) => {
  try {
    await adminController.deleteResultById(req.params.id, req.headers.authorization);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/results', async (req, res, next) => {
  try {
    const data = await adminController.getResultsByTeam(req.query.team, req.headers.authorization);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/teams', async (req, res, next) => {
  try {
    const result = await adminController.createTeam(req.body, req.headers.authorization);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/teams/:id', async (req, res, next) => {
  try {
    const result = await adminController.updateTeam(req.params.id, req.body, req.headers.authorization);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/teams/:id', async (req, res, next) => {
  try {
    const result = await adminController.deleteTeam(req.params.id, req.headers.authorization);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;