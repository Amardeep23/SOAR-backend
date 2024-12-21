const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        enrollmentDate: { type: Date, default: Date.now },
        resources: {
            numberOfCoursesTaken: { type: Number, default: 0 },
            attendancePercentage: { type: Number, default: 0 }, 
            extraCurricularActivities: { type: [String], default: [] }, 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
