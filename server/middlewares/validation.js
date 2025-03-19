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
    result: Joi.string()
      .pattern(/^[0-9]+$/)
      .max(10)
      .required()
      .messages({
        'string.empty': 'Result is required.',
        'string.pattern.base': 'Result must only contain numeric characters.',
        'string.max': 'Result must not exceed 10 characters.'
      }),
    result_time: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      .required()
      .messages({
        'string.empty': 'Result time is required.',
        'string.pattern.base': 'Result time must be in YYYY-MM-DD HH:MM:SS format.'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateDate = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'string.empty': 'Date is required.',
        'string.pattern.base': 'Date must be in YYYY-MM-DD format.'
      })
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateMonthlyResults = (req, res, next) => {
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
    month: Joi.string()
      .pattern(/^\d{4}-\d{2}$/)
      .required()
      .messages({
        'string.empty': 'Month is required.',
        'string.pattern.base': 'Month must be in YYYY-MM format.'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
