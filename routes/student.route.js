const express = require('express');
const { authenticateJWT } = require('../middlewares/_authentication');
const { authorizeRole } = require('../middlewares/_authorization');
const { addStudent, getAllStudentsByClassroom, getStudentById, updateStudentResourcesByName, transferStudent, deleteStudent } = require('../controllers/student.controller');
const  {createStudentSchema, updateStudentResourcesSchema, transferStudentSchema, deleteStudentSchema} = require('../validation/student.validator')
const {validateSchema} = require('../middlewares/_validatorMW')
const router = express.Router();

router.post('/add-student', authenticateJWT, authorizeRole('students', 'C'),  validateSchema(createStudentSchema), async (req, res) => {
    const { name, age, classRoomName, schoolId, resources } = req.body;

    try {
        // Call the controller to add the student
        const result = await addStudent({ name, age, classRoomName, schoolId, resources });

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Student added successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in add-student route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not add student.',
            error: err.message,
        });
    }
});

router.get('/get-students-by-classroom', authenticateJWT, authorizeRole('students', 'R'), async (req, res) => {
    const { classroomId } = req.query;

    if (!classroomId) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: classroomId is required as a query parameter.',
        });
    }

    try {
        const result = await getAllStudentsByClassroom(classroomId);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Students retrieved successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in get-students-by-classroom route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not fetch students.',
            error: err.message,
        });
    }
});

router.get('/get-student-by-id', authenticateJWT, authorizeRole('students', 'R'), async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request: studentId is required as a query parameter.',
        });
    }

    try {
        const result = await getStudentById(studentId);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Student retrieved successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in get-student-by-id route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not fetch student.',
            error: err.message,
        });
    }
});

router.put('/updateStudentResourcesByName', authenticateJWT, authorizeRole('students', 'U'), validateSchema(updateStudentResourcesSchema), async (req, res) => {
    const { name, resources } = req.body;

    try {
        const result = await updateStudentResourcesByName(name, resources);

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Student resources updated successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in updateStudentResourcesByName route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not update student resources.',
            error: err.message,
        });
    }
});

// SUPERADMIN
router.put('/transfer-student', authenticateJWT, authorizeRole('students', 'U'), validateSchema(transferStudentSchema), async (req, res) => {
    if(req.user.role != "SuperAdmin"){
        return res.status(403).json({
            status: 403,
            message: "Access not granted for transer. You must be SuperAdmin"
        })
    }
    const { studentName, newSchoolName, newClassName } = req.body;

    try {
        const result = await transferStudent({ studentName, newSchoolName, newClassName });

        if (result.error) {
            return res.status(result.status).json({
                status: result.status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Student transferred successfully.',
            data: result.data,
        });
    } catch (err) {
        console.error('Error in transfer-student route:', err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Could not transfer student.',
            error: err.message,
        });
    }
});

router.delete("/delete-student", authenticateJWT, authorizeRole("students", "D"), validateSchema(deleteStudentSchema), async (req, res) => {
    const { studentName } = req.body;

    try {
        let schoolId = null;

        // If the role is SchoolAdmin, get the schoolId from req.user
        if (req.user.role === "SchoolAdmin") {
            schoolId = req.user.schoolId;

            if (!schoolId) {
                return res.status(403).json({
                    status: 403,
                    message: "Access Forbidden: schoolId not found for SchoolAdmin.",
                });
            }
        }

        // Pass the studentName and schoolId to the deleteStudent function
        const result = await deleteStudent(studentName, schoolId);

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
        console.error("Error in deleteStudent route:", err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error: Could not delete student.",
            error: err.message,
        });
    }
});

module.exports = router;
