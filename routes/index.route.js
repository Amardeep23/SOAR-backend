const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route')
const schoolRoutes = require('./school.route')
const classroomRoutes = require('./classroom.route')
const studentRoutes = require('./student.route')

router.get('/health', (req, res) => {
    res.status(200).send('Welcome to the School Management API! 📚');
});

router.use('/user', userRoutes);
router.use('/school', schoolRoutes);
router.use('/classroom', classroomRoutes);
router.use('/student', studentRoutes);

module.exports = router;
