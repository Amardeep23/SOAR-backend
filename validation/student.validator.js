const Joi = require('joi');

// Joi schema for creating a student
const createStudentSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  age: Joi.number().integer().min(0).required().messages({
    'number.base': 'Age must be a number.',
    'number.integer': 'Age must be an integer.',
    'number.min': 'Age cannot be negative.',
    'any.required': 'Age is required.',
  }),
  classRoomName: Joi.string().required().messages({
    'string.base': 'Classroom name must be a string.',
    'string.empty': 'Classroom name is required.',
    'any.required': 'Classroom name is required.',
  }),
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) // Validate as MongoDB ObjectId
    .required()
    .messages({
      'string.base': 'School ID must be a string.',
      'string.empty': 'School ID is required.',
      'string.pattern.base': 'School ID must be a valid MongoDB ObjectId.',
      'any.required': 'School ID is required.',
    }),
  resources: Joi.object({
    numberOfCoursesTaken: Joi.number().integer().min(0).required().messages({
      'number.base': 'Number of courses taken must be a number.',
      'number.integer': 'Number of courses taken must be an integer.',
      'number.min': 'Number of courses taken cannot be negative.',
      'any.required': 'Number of courses taken is required.',
    }),
    attendancePercentage: Joi.number().min(0).max(100).required().messages({
      'number.base': 'Attendance percentage must be a number.',
      'number.min': 'Attendance percentage cannot be negative.',
      'number.max': 'Attendance percentage cannot exceed 100.',
      'any.required': 'Attendance percentage is required.',
    }),
    extraCurricularActivities: Joi.array()
      .items(Joi.string())
      .required()
      .messages({
        'array.base': 'Extra-curricular activities must be an array of strings.',
        'string.base': 'Each activity must be a string.',
        'any.required': 'Extra-curricular activities are required.',
      }),
  }).required().messages({
    'any.required': 'Resources are required.',
  }),
});


const updateStudentResourcesSchema = Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Student name is required.',
      'any.required': 'Student name is required.',
    }),
    resources: Joi.object({
      numberOfCoursesTaken: Joi.number().integer().min(0).messages({
        'number.base': 'Number of courses taken must be a number.',
        'number.integer': 'Number of courses taken must be an integer.',
        'number.min': 'Number of courses taken cannot be negative.',
      }),
      attendancePercentage: Joi.number().min(0).max(100).messages({
        'number.base': 'Attendance percentage must be a number.',
        'number.min': 'Attendance percentage cannot be negative.',
        'number.max': 'Attendance percentage cannot exceed 100.',
      }),
      extraCurricularActivities: Joi.array()
        .items(Joi.string())
        .messages({
          'array.base': 'Extra-curricular activities must be an array of strings.',
          'string.base': 'Each activity must be a string.',
        }),
    })
      .required()
      .messages({
        'any.required': 'Resources are required.',
      }),
  });


  const transferStudentSchema = Joi.object({
    studentName: Joi.string().required().messages({
      'string.base': 'Student name must be a string.',
      'string.empty': 'Student name is required.',
      'any.required': 'Student name is required.',
    }),
    newSchoolName: Joi.string().required().messages({
      'string.base': 'New school name must be a string.',
      'string.empty': 'New school name is required.',
      'any.required': 'New school name is required.',
    }),
    newClassName: Joi.string().required().messages({
      'string.base': 'New class name must be a string.',
      'string.empty': 'New class name is required.',
      'any.required': 'New class name is required.',
    }),
  });

  
const deleteStudentSchema = Joi.object({
    studentName: Joi.string().required().messages({
        'string.base': 'Student name must be a string.',
        'string.empty': 'Student name is required.',
        'any.required': 'Student name is required.',
    }),
});
module.exports = { createStudentSchema, updateStudentResourcesSchema, transferStudentSchema, deleteStudentSchema };
