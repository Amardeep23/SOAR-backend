const mongoose = require("mongoose");
const School = require("../model/school.model");
const Classroom = require("../model/classroom.model");
const Student = require("../model/student.model");

const createClassroom = async (data) => {
    const { name, resources, schoolName } = data;

    try {
        // Validate if school exists
        const school = await School.findOne({name: schoolName});
        if (!school) {
            return {
                error: true,
                status: 404,
                message: 'School not found.',
            };
        }
        const newClassroom = new Classroom({
            name,
            schoolId: school._id, 
            resources: {
                capacity: resources.capacity || 0,
                numberOfDesks: resources.numberOfDesks || 0, 
                smartBoardAvailable: resources.smartBoardAvailable || false, 
            },
        });

        await newClassroom.save();

        // Add classroom to the school's classrooms array
        school.classrooms.push(newClassroom._id);
        await school.save();

        return {
            error: false,
            data: newClassroom,
        };
    } catch (err) {
        console.error('Error in createClassroom controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not create classroom.',
        };
    }
};


const fetchAllClassroomsBySchool = async (schoolId) => {
    try {
        const classrooms = await Classroom.find({ schoolId });

        if (!classrooms || classrooms.length === 0) {
            return {
                error: true,
                status: 404,
                message: 'No classrooms found for the specified school.',
            };
        }

        return {
            error: false,
            data: classrooms,
        };
    } catch (error) {
        console.error('Error in fetchAllClassroomsBySchool controller:', error);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not fetch classrooms.',
        };
    }
};


const getClassroomByID = async (classRoomId) => {
    try {
        const classRoom = await Classroom.findById(classRoomId);

        if (!classRoom) {
            return null; 
        }

        return {
            error: false,
            data: classRoom
        };
    } catch (err) {
        console.error('Error in getClassroomByID controller:', err);
        throw new Error('Could not retrieve classroom details.');
    }
};

const updateClassroomResource = async (classroomId, resources) => {
    try {
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return {
                error: true,
                status: 404,
                message: 'Classroom not found.',
            };
        }

        if (resources.capacity !== undefined) {
            classroom.resources.capacity = resources.capacity;
        }
        if (resources.numberOfDesks !== undefined) {
            classroom.resources.numberOfDesks = resources.numberOfDesks;
        }
        if (resources.smartBoardAvailable !== undefined) {
            classroom.resources.smartBoardAvailable = resources.smartBoardAvailable;
        }

        const updatedClassroom = await classroom.save();

        return {
            error: false,
            data: updatedClassroom,
        };
    } catch (err) {
        console.error('Error in updateClassroomResource controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not update classroom resource.',
        };
    }
};

const deleteClassroom = async (classroomName, schoolId = null) => {
    const session = await Classroom.startSession();
    session.startTransaction();

    try {
        // Find the classroom by name and schoolId (if provided)
        const classroom = schoolId
            ? await Classroom.findOne({ name: classroomName, schoolId })
            : await Classroom.findOne({ name: classroomName });

        if (!classroom) {
            throw {
                error: true,
                status: 404,
                message: "Classroom not found.",
            };
        }

        // Remove the classroom from the associated school's classrooms array
        const school = await School.findById(classroom.schoolId);
        if (school) {
            school.classrooms = school.classrooms.filter(
                (classroomId) => classroomId.toString() !== classroom._id.toString()
            );
            await school.save({ session });
        }

        // Remove all students associated with this classroom
        await Student.deleteMany({ classroomId: classroom._id }, { session });

        // Finally, delete the classroom
        await Classroom.deleteOne({ _id: classroom._id }, { session });

        await session.commitTransaction();
        session.endSession();

        return {
            error: false,
            message: "Classroom and associated students deleted successfully.",
        };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in deleteClassroom controller:", err);

        if (err.error) {
            return err; // Pass the thrown error with status and message
        }

        return {
            error: true,
            status: 500,
            message: "Internal Server Error: Could not delete classroom.",
        };
    }
};

module.exports = { createClassroom, fetchAllClassroomsBySchool, getClassroomByID, updateClassroomResource, deleteClassroom };