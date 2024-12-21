const Joi = require('joi');


const createSchoolSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'School name must be a string.',
        'string.empty': 'School name is required.',
        'any.required': 'School name is required.',
    }),
    address: Joi.string()
        .pattern(/^[a-zA-Z0-9\s,.-]+$/)
        .min(5)
        .max(255)
        .required()
        .messages({
            'string.pattern.base': 'Address can only contain letters, numbers, spaces, commas, dots, and hyphens.',
            'string.base': 'Address must be a string.',
            'string.empty': 'Address is required.',
            'string.min': 'Address must be at least 5 characters long.',
            'string.max': 'Address must not exceed 255 characters.',
            'any.required': 'Address is required.',
        }),
    resources: Joi.object({
        numberOfBuses: Joi.number().integer().min(0).default(0).required().messages({
            'number.base': 'Number of buses must be a number.',
            'number.integer': 'Number of buses must be an integer.',
            'number.min': 'Number of buses cannot be negative.',
            'any.required': 'Number of buses is required.',
        }),
        libraryBooks: Joi.number().integer().min(0).default(0).required().messages({
            'number.base': 'Library books must be a number.',
            'number.integer': 'Library books must be an integer.',
            'number.min': 'Library books cannot be negative.',
            'any.required': 'Library books are required.',
        }),
        sportsFacilities: Joi.boolean().default(false).required().messages({
            'boolean.base': 'Sports facilities must be a boolean.',
            'any.required': 'Sports facilities is required.',
        }),
    }).required().messages({
        'any.required': 'Resources are required.',
    }),
    schoolAdmins: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Validate as MongoDB ObjectId
        .messages({
            'array.base': 'SchoolAdmins must be an array.',
            'string.pattern.base': 'Each schoolAdmin ID must be a valid MongoDB ObjectId.',
        }),
    classrooms: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Validate as MongoDB ObjectId
        .messages({
            'array.base': 'Classrooms must be an array.',
            'string.pattern.base': 'Each classroom ID must be a valid MongoDB ObjectId.',
        }),
});


const deleteSchoolSchema = Joi.object({
    schoolName: Joi.string().required().messages({
        'string.base': 'School name must be a string.',
        'string.empty': 'School name is required.',
        'any.required': 'School name is required.',
    }),
});


const updateResourcesSchema = Joi.object({
    resources: Joi.object({
        numberOfBuses: Joi.number().integer().min(0).messages({
            'number.base': 'Number of buses must be a number.',
            'number.integer': 'Number of buses must be an integer.',
            'number.min': 'Number of buses cannot be negative.',
        }),
        libraryBooks: Joi.number().integer().min(0).messages({
            'number.base': 'Library books must be a number.',
            'number.integer': 'Library books must be an integer.',
            'number.min': 'Library books cannot be negative.',
        }),
        sportsFacilities: Joi.boolean().messages({
            'boolean.base': 'Sports facilities must be a boolean.',
        }),
    })
        .required()
        .messages({
            'any.required': 'Resources are required.',
        }),
});




module.exports = { createSchoolSchema, deleteSchoolSchema, updateResourcesSchema };
