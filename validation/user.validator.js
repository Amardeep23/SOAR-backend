const Joi = require('joi');

const createSuperAdminSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  superadminKey: Joi.string().required().messages({
    'string.empty': 'SuperadminKey is required',
    'any.required': 'SuperadminKey is required',
  }),
});


const createSchoolAdminSchema = Joi.object({
    username: Joi.string().required().messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'any.required': 'Username is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
    schoolName: Joi.string().required().messages({
      'string.base': 'School name must be a string',
      'string.empty': 'School name is required',
      'any.required': 'School name is required',
    }),
  });

  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.',
    }),
  });

module.exports = { createSuperAdminSchema, createSchoolAdminSchema, loginSchema };
