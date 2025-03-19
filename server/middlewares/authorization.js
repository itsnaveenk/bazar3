const db = require('../db');

exports.authorizeAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required.' });
    }

    const [admin] = await db.query('SELECT id FROM admins WHERE session_token = ?', [token]);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error during authorization.' });
  }
};
