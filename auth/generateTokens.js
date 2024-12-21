const jwt = require('jsonwebtoken');
const UserToken = require('../model/jwt.model'); 


const generateJWT = (user) => {
  const payload = { id: user._id, role: user.role };

  if (user.role === 'SchoolAdmin' && user.schoolId) {
    payload.schoolId = user.schoolId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};



const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  try {
   
    await UserToken.deleteMany({ userId: user._id });

    
    const newToken = new UserToken({
      userId: user._id,
      token: refreshToken,
    });
    await newToken.save();
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Could not store refresh token');
  }

  return refreshToken;
};


const refreshAccessToken = async (refreshToken) => {
  try {
    
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    
    const existingToken = await UserToken.findOne({ userId: payload.id, token: refreshToken });
    if (!existingToken) {
      throw new Error('Refresh token is invalid or has been removed.');
    }

    const newAccessToken = generateJWT({ _id: payload.id, role: payload.role });

    return { accessToken: newAccessToken };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Could not refresh access token');
  }
};

module.exports = { generateJWT, generateRefreshToken, refreshAccessToken };
