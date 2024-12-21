const express = require('express');
const { authenticateJWT } = require('../middlewares/_authentication');
const { authorizeRole } = require('../middlewares/_authorization');
const { createClassroom, fetchAllClassroomsBySchool, getClassroomByID, updateClassroomResource, deleteClassroom } = require('../controllers/classroom.controller')
const {validateSchema} = require('../middlewares/_validatorMW');
const {createClassroomSchema, updateClassroomResourcesSchema, deleteClassroomSchema} = require('../validation/classroom.validator');

const router = express.Router();



router.post('/create-classroom', authenticateJWT, authorizeRole('classrooms', 'C'), validateSchema(createClassroomSchema), async (req, res) => {
    const { name, resources, schoolName } = req.body;

    try {
        const result = await createClassroom({ name, resources, schoolName });

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Classroom created successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in createClassroom route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not create classroom.',
            error: err.message,
        });
    }
});


router.get('/allClassroomsBySchool', authenticateJWT, authorizeRole('classrooms', 'R'), async (req, res) => {
    const { schoolId } = req.query

    if (!schoolId) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: schoolId is required as a parameter.',
        });
    }

    try {
        const result = await fetchAllClassroomsBySchool(schoolId);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Classrooms retrieved successfully.',
            data: result.data,
        });
    } catch (error) {
        console.error('Error in allClassroomsBySchool route:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not fetch classrooms.',
            error: error.message,
        });
    }
});


router.get('/getClassroomById', authenticateJWT, authorizeRole('classrooms', 'R'), async (req, res) => {
    const { classRoomId } = req.query;

    if (!classRoomId) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: classRoomId is required as a query parameter.',
        });
    }

    try {
        const classRoom = await getClassroomByID(classRoomId);

        if (!classRoom) {
            return res.status(404).json({
                status: 404,
                message: 'Classroom not found.',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Classroom details retrieved successfully.',
            data: classRoom.data,
        });
    } catch (err) {
        console.error('Error in getClassroomById route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not fetch classroom details.',
            error: err.message,
        });
    }
});

router.put('/updateClassroomResource', authenticateJWT, authorizeRole('classrooms', 'U'), validateSchema(updateClassroomResourcesSchema), async (req, res) => {
    const { classroomId, resources } = req.body;

    try {
        const result = await updateClassroomResource(classroomId, resources);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Classroom resource updated successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in updateClassroomResource route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not update classroom resource.',
            error: err.message,
        });
    }
});

router.delete("/delete-classroom", authenticateJWT, authorizeRole("classrooms", "D"), validateSchema(deleteClassroomSchema), async (req, res) => {
    const { classroomName } = req.body;
    try {
        let schoolId = null;
        if (req.user.role === "SchoolAdmin") {
            schoolId = req.user.schoolId;

            if (!schoolId) {
                return res.status(403).json({
                    status: 403,
                    message: "Access Forbidden: schoolId not found for SchoolAdmin.",
                });
            }
        }

        const result = await deleteClassroom(classroomName, schoolId);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: result.message,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error: Could not delete classroom.",
            error: err.message,
        });
    }
});

module.exports = router;