const Joi = require('joi');

const createClassroomSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Classroom name must be a string.',
        'string.empty': 'Classroom name is required.',
        'any.required': 'Classroom name is required.',
    }),
    schoolName: Joi.string().required().messages({
        'string.base': 'School name must be a string.',
        'string.empty': 'School name is required.',
        'any.required': 'School name is required.',
    }),
    resources: Joi.object({
        capacity: Joi.number().integer().min(0).required().messages({
            'number.base': 'Capacity must be a number.',
            'number.integer': 'Capacity must be an integer.',
            'number.min': 'Capacity cannot be negative.',
            'any.required': 'Capacity is required.',
        }),
        numberOfDesks: Joi.number().integer().min(0).required().messages({
            'number.base': 'Number of desks must be a number.',
            'number.integer': 'Number of desks must be an integer.',
            'number.min': 'Number of desks cannot be negative.',
            'any.required': 'Number of desks is required.',
        }),
        smartBoardAvailable: Joi.boolean().required().messages({
            'boolean.base': 'SmartBoardAvailable must be a boolean.',
            'any.required': 'SmartBoardAvailable is required.',
        }),
    }).required().messages({
        'any.required': 'Resources are required.',
    }),
});

const updateClassroomResourcesSchema = Joi.object({
    classroomId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/) // Validate as MongoDB ObjectId
        .required()
        .messages({
            'string.base': 'Classroom ID must be a string.',
            'string.empty': 'Classroom ID is required.',
            'string.pattern.base': 'Classroom ID must be a valid MongoDB ObjectId.',
            'any.required': 'Classroom ID is required.',
        }),
    resources: Joi.object({
        capacity: Joi.number().integer().min(0).messages({
            'number.base': 'Capacity must be a number.',
            'number.integer': 'Capacity must be an integer.',
            'number.min': 'Capacity cannot be negative.',
        }),
        numberOfDesks: Joi.number().integer().min(0).messages({
            'number.base': 'Number of desks must be a number.',
            'number.integer': 'Number of desks must be an integer.',
            'number.min': 'Number of desks cannot be negative.',
        }),
        smartBoardAvailable: Joi.boolean().messages({
            'boolean.base': 'SmartBoardAvailable must be a boolean.',
        }),
    })
        .required()
        .messages({
            'any.required': 'Resources are required.',
        }),
});


const deleteClassroomSchema = Joi.object({
    classroomName: Joi.string().required().messages({
        'string.base': 'Classroom name must be a string.',
        'string.empty': 'Classroom name is required.',
        'any.required': 'Classroom name is required.',
    }),
});

module.exports = { createClassroomSchema, updateClassroomResourcesSchema, deleteClassroomSchema };
