const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        resources: {
            numberOfBuses: { type: Number, default: 0 },
            libraryBooks: { type: Number, default: 0 },
            sportsFacilities: { type: Boolean, default: false },
        },
        schoolAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('School', SchoolSchema);
