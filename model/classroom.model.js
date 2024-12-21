const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        resources: {
            capacity: { type: Number, default: 0 },
            numberOfDesks: { type: Number, default: 0 }, 
            smartBoardAvailable: { type: Boolean, default: false }, 
        },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], 
    },
    { timestamps: true }
);

module.exports = mongoose.model('Classroom', ClassroomSchema);
