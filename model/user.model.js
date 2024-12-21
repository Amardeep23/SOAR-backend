const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['SuperAdmin', 'SchoolAdmin'],
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            default: null,
            validate: {
                validator: function (value) {
                    if (this.role === 'SchoolAdmin' && !value) {
                        return false;
                    }
                    return true;
                },
                message: 'schoolId is required for SchoolAdmin role.',
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
