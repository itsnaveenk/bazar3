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

module.exports = router;