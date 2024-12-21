const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const School = require('../model/school.model')
const { generateJWT, generateRefreshToken } = require('../auth/generateTokens'); // Ensure path is correct
const UserToken = require('../model/jwt.model');
const { appendSchoolAdmin } = require('./school.controller')

const createSuperAdmin = async (data) => {
  const { username, email, password, superadminKey } = data;

  if (superadminKey !== process.env.SUPERADMIN_KEY) {
    return { error: true, status: 403, message: 'Forbidden: Invalid SuperAdmin key.' };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: true, status: 409, message: 'Conflict: User already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'SuperAdmin',
      schoolId: null,
    });

    await newSuperAdmin.save();

    return { error: false, user: newSuperAdmin }; 
  } catch (error) {
    return { error: true, status: 500, message: 'Internal Server Error: Could not create SuperAdmin.' };
  }
};

const createSchoolAdmin = async (data) => {
  const { username, email, password, schoolName } = data;

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: true, status: 409, message: 'Conflict: User already exists.' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const school = await School.findOne({ name: schoolName });
    if (!school) {
      return { error: true, status: 404, message: 'School not found.' };
    }
    const newSchoolAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'SchoolAdmin',
      schoolId: school._id,
    });

    await newSchoolAdmin.save();
    const appendResult = await appendSchoolAdmin(school._id, newSchoolAdmin._id);
    if (appendResult.error) {
      return { error: true, status: appendResult.status, message: appendResult.message };
    }
    return { error: false, user: newSchoolAdmin };

  } catch (error) {
    console.error('Error in createSchoolAdmin:', error);
    return { error: true, status: 500, message: 'Internal Server Error: Could not create SchoolAdmin.' };
  }
};


const loginUser = async (data) => {
  const { email, password } = data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { error: true, status: 404, message: 'User not found.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: true, status: 401, message: 'Invalid credentials.' };
    }

    const accessToken = generateJWT({ _id: user._id, role: user.role,schoolId:  user.schoolId });
    const refreshToken = await generateRefreshToken(user);

    return { error: false, tokens: { accessToken, refreshToken } };
  } catch (error) {
    return { error: true, status: 500, message: 'Internal Server Error: Could not log in.' };
  }
};

const logoutUser = async (data) => {
  const { userId, refreshToken } = data;

  try {
    // Remove the refresh token from the database
    const tokenRemoved = await UserToken.findOneAndDelete({ userId, token: refreshToken });

    if (!tokenRemoved) {
      return { error: true, status: 404, message: 'Token not found or already removed.' };
    }

    return { error: false, message: 'Logout successful.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: true, status: 500, message: 'Internal Server Error: Could not log out.' };
  }
};

module.exports = { createSuperAdmin, createSchoolAdmin, loginUser , logoutUser};
