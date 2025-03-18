const crypto = require('crypto');

function sanitize(input) {
  if (typeof input === 'string') {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (Array.isArray(input)) {
    return input.map(sanitize);
  }
  if (input && typeof input === 'object') {
    const sanitizedObj = {};
    for (const key in input) {
      if (Object.hasOwnProperty.call(input, key)) {
        sanitizedObj[key] = sanitize(input[key]);
      }
    }
    return sanitizedObj;
  }
  return input;
}

module.exports = {
  anonymizeIP: (req, res, next) => {
    const ip = req.ip || '127.0.0.1';
    const salt = Math.floor(Date.now() / 3600000);
    req.anonymizedIP = crypto.createHash('sha3-256')
      .update(ip + salt + process.env.IP_PEPPER)
      .digest('hex');
    next();
  },
  sanitizeInput: (req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
  }
};