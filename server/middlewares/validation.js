const Joi = require('joi');

exports.validateTeam = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateResult = (req, res, next) => {
  const schema = Joi.object({
    team: Joi.string().max(100).required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    result: Joi.string().max(10).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
