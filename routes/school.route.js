const express = require('express');
const { authenticateJWT } = require('../middlewares/_authentication');
const { authorizeRole } = require('../middlewares/_authorization');
const { createSchool, allSchoolData, deleteSchool, getSchoolDetails, updateSchoolProfile } = require('../controllers/school.controller');
const {createSchoolSchema, deleteSchoolSchema, updateResourcesSchema} = require('../validation/school.validator')
const {validateSchema} = require('../middlewares/_validatorMW');
const { validate } = require('../model/school.model');

const router = express.Router();


// SUPERADMIN
router.post('/create-school', authenticateJWT, authorizeRole('schools', 'C'), validateSchema(createSchoolSchema), async (req, res) => {
        try {
            const { name, address, resources, schoolAdmins, classrooms } = req.body;
            
            const result = await createSchool({ name, address, resources, schoolAdmins, classrooms });

            if (result.error) {
                return res.status(result.status).json({
                    status: result.status,
                    message: result.message,
                });
            }

            return res.status(201).json({
                status: 201,
                message: 'School created successfully.',
                school: result.school,
            });
        } catch (error) {
            console.error('Error in create-school route:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error: Could not process request.',
                error: error.message,
            });
        }
    }
);

// SUPERADMIN
router.get('/all-schools',authenticateJWT,authorizeRole('schools', 'R'), async (req, res) => {
        try {
            const result = await allSchoolData();

            if (result.error) {
                return res.status(result.status).json({
                    status: result.status,
                    message: result.message,
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Schools retrieved successfully.',
                data: result.data,
            });
        } catch (error) {
            console.error('Error in all-schools route:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error: Could not retrieve schools.',
                error: error.message,
            });
        }
    }
);

// SUPERADMIN
router.delete('/delete-school', authenticateJWT, authorizeRole('schools', 'D'), validateSchema(deleteSchoolSchema), async (req, res) => {
    const { schoolName } = req.body;

    if (!schoolName) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: School name is required.',
        });
    }

    try {
        const result = await deleteSchool(schoolName);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'School and associated admins deleted successfully.',
        });
    } catch (err) {
        console.error('Error in delete-school route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not process request.',
            error: err.message,
        });
    }
});


router.put('/updateSchoolProfile', authenticateJWT, authorizeRole('schools', 'U'), validateSchema(updateResourcesSchema), async (req, res) => {
    try {
        const { schoolId } = req.query; // Get schoolID from query parameters
        const { resources } = req.body;

        if (!schoolId) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request: schoolId is required.',
            });
        }
        const result = await updateSchoolProfile(schoolId, resources);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'School resources updated successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in updateSchoolProfile route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not update school resources.',
            error: err.message,
        });
    }
});


router.get('/getSchoolDetails', authenticateJWT, authorizeRole('schools', 'R'), async (req, res) => {
    try {
        const { schoolId } = req.query; // Extract schoolID from query parameters

        if (!schoolId) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request: schoolId is required.',
            });
        }

        // Call the controller with the schoolId
        const result = await getSchoolDetails(schoolId);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'School details retrieved successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in getSchoolDetails route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not process request.',
            error: err.message,
        });
    }
});



module.exports = router;
