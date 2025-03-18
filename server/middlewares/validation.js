const Joi = require('joi');

exports.validateTeam = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Team name is required.',
        'string.pattern.base': 'Team name must only contain alphanumeric characters and spaces.',
        'string.max': 'Team name must not exceed 100 characters.'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateResult = (req, res, next) => {
  const schema = Joi.object({
    team: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Team name is required.',
        'string.pattern.base': 'Team name must only contain alphanumeric characters and spaces.',
        'string.max': 'Team name must not exceed 100 characters.'
      }),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'string.empty': 'Date is required.',
        'string.pattern.base': 'Date must be in YYYY-MM-DD format.'
      }),
    result: Joi.string()
      .pattern(/^[0-9]+$/)
      .max(10)
      .required()
      .messages({
        'string.empty': 'Result is required.',
        'string.pattern.base': 'Result must only contain numeric characters.',
        'string.max': 'Result must not exceed 10 characters.'
      }),
    announcement_time: Joi.string()
      .pattern(/^\d{2}:\d{2}:\d{2}$/)
      .required()
      .messages({
        'string.empty': 'Announcement time is required.',
        'string.pattern.base': 'Announcement time must be in HH:MM:SS format.'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
