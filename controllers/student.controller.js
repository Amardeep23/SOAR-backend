const Student = require('../model/student.model');
const Classroom = require('../model/classroom.model');
const School = require('../model/school.model')

const addStudent = async (data) => {
    const { name, age, classRoomName, schoolId, resources } = data;

    try {
        // const school = await School.findOne({name: schoolName});
        const classroom = await Classroom.findOne({ name: classRoomName });
        if (!classroom) {
            return {
                error: true,
                status: 404,
                message: 'Classroom not found.',
            };
        }
        const existingStudent = await Student.findOne({name});
        if(existingStudent){
            return {
                error: true,
                status: 409,
                message: "Student already exists"
            }
        }
        // Create the new student
        const newStudent = new Student({
            name,
            age,
            classroomId: classroom._id,
            schoolId,
            resources: resources || {}, // Optional field
        });
        const savedStudent = await newStudent.save();

        // Add the student's ID to the classroom's students array
        classroom.students.push(savedStudent._id);
        await classroom.save();

        return {
            error: false,
            data: savedStudent,
        };
    } catch (err) {
        console.error('Error in addStudent controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not add student.',
        };
    }
};

const getStudentById = async (studentId) => {
    try {
        const student = await Student.findById(studentId);

        if (!student) {
            return {
                error: true,
                status: 404,
                message: 'Student not found.',
            };
        }

        return {
            error: false,
            data: student,
        };
    } catch (err) {
        console.error('Error in getStudentById controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not retrieve student.',
        };
    }
};

const getAllStudentsByClassroom = async (classroomId) => {
    try {
        // Fetch the classroom by ID
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return {
                error: true,
                status: 404,
                message: 'Classroom not found.',
            };
        }

        // Extract student IDs from the classroom
        const studentIds = classroom.students;

        if (!studentIds || studentIds.length === 0) {
            return {
                error: true,
                status: 404,
                message: 'No students found in the classroom.',
            };
        }

        // Fetch all student details using the student IDs
        const students = await Student.find({ _id: { $in: studentIds } });

        return {
            error: false,
            data: students,
        };
    } catch (err) {
        console.error('Error in getAllStudentsByClassroom controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not retrieve students.',
        };
    }
};

const updateStudentResourcesByName = async (name, resources) => {
    try {
        const student = await Student.findOne({ name });

        if (!student) {
            return {
                error: true,
                status: 404,
                message: 'Student not found.',
            };
        }

        // Update only the provided fields in resources
        if (resources.numberOfCoursesTaken !== undefined) {
            student.resources.numberOfCoursesTaken = resources.numberOfCoursesTaken;
        }
        if (resources.attendancePercentage !== undefined) {
            student.resources.attendancePercentage = resources.attendancePercentage;
        }
        if (resources.extraCurricularActivities !== undefined) {
            student.resources.extraCurricularActivities = resources.extraCurricularActivities;
        }

        const updatedStudent = await student.save();

        return {
            error: false,
            data: updatedStudent,
        };
    } catch (err) {
        console.error('Error in updateStudentResourcesByName controller:', err);
        return {
            error: true,
            status: 500,
            message: 'Internal Server Error: Could not update student resources.',
        };
    }
};

const transferStudent = async ({ studentName, newSchoolName, newClassName }) => {
    const session = await Classroom.startSession(); // Transaction session (Optional)
    session.startTransaction();

    try {
        // Find the student by name
        const student = await Student.findOne({ name: studentName });
        if (!student) {
            throw { status: 404, message: 'Student not found.' };
        }

        // Get the old classroom
        const oldClassroom = await Classroom.findById(student.classroomId);
        if (!oldClassroom) {
            throw { status: 404, message: 'Old classroom not found.' };
        }

        // Get the new school and classroom
        const newSchool = await School.findOne({ name: newSchoolName });
        if (!newSchool) {
            throw { status: 404, message: 'New school not found.' };
        }

        const newClassroom = await Classroom.findOne({ name: newClassName, schoolId: newSchool._id });
        if (!newClassroom) {
            throw { status: 404, message: 'New classroom not found in the specified school.' };
        }

        // Remove studentId from the old classroom
        oldClassroom.students.pull(student._id);
        await oldClassroom.save();

        // Add studentId to the new classroom
        newClassroom.students.push(student._id);
        await newClassroom.save();

        // Update the student's schoolId and classroomId
        student.schoolId = newSchool._id;
        student.classroomId = newClassroom._id;
        await student.save();

        await session.commitTransaction(); // Commit transaction
        session.endSession();

        return {
            error: false,
            data: { student, oldClassroom, newClassroom },
        };
    } catch (err) {
        await session.abortTransaction(); // Abort transaction in case of error
        session.endSession();

        console.error('Error in transferStudent controller:', err);
        return {
            error: true,
            status: err.status || 500,
            message: err.message || 'Internal Server Error: Could not transfer student.',
        };
    }
};

const deleteStudent = async (studentName, schoolId = null) => {
    const session = await Student.startSession();
    session.startTransaction();

    try {
        // Find the student by name and (optionally) schoolId
        const student = schoolId
            ? await Student.findOne({ name: studentName, schoolId })
            : await Student.findOne({ name: studentName });

        if (!student) {
            throw {
                error: true,
                status: 404,
                message: "Student not found.",
            };
        }

        // Find the classroom the student belongs to
        const classroom = await Classroom.findById(student.classroomId);
        if (!classroom) {
            throw {
                error: true,
                status: 404,
                message: "Classroom not found for the student.",
            };
        }

        // Remove the student from the classroom's students array
        classroom.students = classroom.students.filter(
            (studentId) => studentId.toString() !== student._id.toString()
        );
        await classroom.save({ session });

        // Delete the student
        await Student.deleteOne({ _id: student._id }, { session });

        await session.commitTransaction();
        session.endSession();

        return {
            error: false,
            message: "Student deleted successfully and removed from the classroom.",
        };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in deleteStudent controller:", err);

        if (err.error) {
            return err; // Pass the thrown error with status and message
        }

        return {
            error: true,
            status: 500,
            message: "Internal Server Error: Could not delete student.",
        };
    }
};



module.exports = { addStudent , getStudentById, getAllStudentsByClassroom, updateStudentResourcesByName, transferStudent, deleteStudent};
