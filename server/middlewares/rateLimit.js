const { RateLimiterMemory } = require('rate-limiter-flexible');

const publicLimiter = new RateLimiterMemory({
  points: 1000,
  duration: 60
});

module.exports = {
  publicLimiter: (req, res, next) => {
    publicLimiter.consume(req.anonymizedIP)
      .then(() => next())
      .catch(() => res.status(429).json({ error: 'Too many requests' }));
  }
};