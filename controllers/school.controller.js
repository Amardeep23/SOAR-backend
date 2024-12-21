const mongoose = require('mongoose');
const School = require('../model/school.model');
const Classroom = require('../model/classroom.model');
const Student = require('../model/student.model');
const User = require('../model/user.model');

const createSchool = async ({ name, address, resources, schoolAdmins, classrooms }) => {
    try {
        const existingSchool = await School.findOne({ name });
        if (existingSchool) {
            return {
                error: true,
                status: 409,
                message: 'Conflict: School already exists.',
            };
        }
        const newSchool = new School({
            name,
            address,
            resources: {
                numberOfBuses: resources.numberOfBuses,
                libraryBooks: resources.libraryBooks,
                sportsFacilities: resources.sportsFacilities,
            },
            schoolAdmins: schoolAdmins || [],
            classrooms: classrooms || [],
        });

        // Save to the database
        await newSchool.save();

        return {
            error: false,
            school: newSchool,
        };
    } catch (error) {
        console.error('Error in createSchool controller:', error);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not create school.',
        };
    }
};

const allSchoolData = async () => {
    try {
        const schools = await School.find(); 
        return {
            error: false,
            data: schools,
        };
    } catch (error) {
        console.error('Error in allSchoolData controller:', error);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not retrieve schools.',
        };
    }
};

const appendSchoolAdmin = async (schoolID, schooladminID) => {
    try {
        const school = await School.findById({_id: schoolID});

        if (!school) {
            return {
                error: true,
                status: 404,
                message: 'School not found.',
            };
        }
        if (school.schoolAdmins.includes(schooladminID)) {
            return {
                error: true,
                status: 409,
                message: 'School admin already exists in this school.',
            };
        }
        school.schoolAdmins.push(schooladminID);
        await school.save();

        return {
            error: false,
            message: 'School admin added successfully.',
            school,
        };
    } catch (err) {
        console.error('Error in addSchoolAdmin function:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not add school admin.',
        };
    }
};

const deleteSchool = async (schoolName) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Find the school by name
        const school = await School.findOne({ name: schoolName }).session(session);

        if (!school) {
            await session.abortTransaction();
            return {
                error: true,
                status: 404,
                message: 'School not found.',
            };
        }

        const schoolId = school._id;
        const schoolAdmins = school.schoolAdmins;

        // Find all classrooms associated with the school
        const classrooms = await Classroom.find({ schoolId }).session(session);

        // Collect all student IDs from the classrooms
        const studentIds = classrooms.reduce((ids, classroom) => {
            return ids.concat(classroom.students);
        }, []);

        // Delete all students associated with the classrooms
        if (studentIds.length > 0) {
            await Student.deleteMany({ _id: { $in: studentIds } }).session(session);
        }

        // Delete all classrooms associated with the school
        await Classroom.deleteMany({ schoolId }).session(session);

        // Delete all school admins
        if (schoolAdmins && schoolAdmins.length > 0) {
            await User.deleteMany({ _id: { $in: schoolAdmins } }).session(session);
        }

        // Delete the school itself
        await School.deleteOne({ _id: schoolId }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        return {
            error: false,
            message: 'School, associated classrooms, students, and admins deleted successfully.',
        };
    } catch (err) {
        console.error('Error in deleteSchool controller:', err);
        await session.abortTransaction();
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not delete school and related entities.',
        };
    } finally {
        session.endSession();
    }
};

const getSchoolDetails = async (schoolId) => {
    try {
        const school = await School.findById(schoolId)

        if (!school) {
            return {
                error: true,
                status: 404,
                message: 'School not found.',
            };
        }

        return {
            error: false,
            data: school,
        };
    } catch (error) {
        console.error('Error in getSchoolDetails controller:', error);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not retrieve school details.',
        };
    }
};
const updateSchoolProfile = async (schoolId, resources) => {
    try {
        const school = await School.findById(schoolId); // Find school by ID

        if (!school) {
            return {
                error: true,
                status: 404,
                message: 'School not found.',
            };
        }

        // Update only the provided resource fields
        if (resources.numberOfBuses !== undefined) {
            school.resources.numberOfBuses = resources.numberOfBuses;
        }
        if (resources.libraryBooks !== undefined) {
            school.resources.libraryBooks = resources.libraryBooks;
        }
        if (resources.sportsFacilities !== undefined) {
            school.resources.sportsFacilities = resources.sportsFacilities;
        }

        const updatedSchool = await school.save();

        return {
            error: false,
            data: updatedSchool,
        };
    } catch (err) {
        console.error('Error in updateSchoolProfile controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not update school resources.',
        };
    }
};


module.exports = { createSchool, allSchoolData, appendSchoolAdmin, deleteSchool, getSchoolDetails, updateSchoolProfile};
