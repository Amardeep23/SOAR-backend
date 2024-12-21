const express = require('express');
const { authenticateJWT } = require('../middlewares/_authentication');
const { createSuperAdmin, createSchoolAdmin, loginUser, logoutUser } = require('../controllers/user.controller');
const { generateJWT, generateRefreshToken,refreshAccessToken } = require('../auth/generateTokens'); 
const router = express.Router();
const jwt = require('jsonwebtoken');
const {validateSchema} = require('../middlewares/_validatorMW')
const {createSuperAdminSchema, createSchoolAdminSchema, loginSchema} = require('../validation/user.validator')

router.post('/create-superadmin',validateSchema(createSuperAdminSchema), async (req, res) => {

  try {
    const response = await createSuperAdmin(req.body);

    if (response.error) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: response.message });
    }

    const accessToken = generateJWT({ _id: response.user._id, role: response.user.role });
    const refreshToken = await generateRefreshToken(response.user); 

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({ status: 201, message: 'SuperAdmin created successfully.' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
});

router.post('/create-schooladmin', authenticateJWT, validateSchema(createSchoolAdminSchema), async (req, res) => {

  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ status: 403, message: 'Forbidden: Only a SuperAdmin can create a SchoolAdmin.' });
  }

  try {
    const response = await createSchoolAdmin(req.body);

    if (response.error) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: response.message });
    }

    
    const accessToken = generateJWT({ _id: response.user._id, role: response.user.role, schoolId: response.user.schoolId });
    const refreshToken = await generateRefreshToken(response.user);

    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({ status: 201, message: 'SchoolAdmin created successfully.' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
});


router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ status: 401, message: 'Refresh token is missing.' });
  }

  try {
    const { accessToken } = await refreshAccessToken(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, 
    });

    return res.status(200).json({ status: 200, message: 'Access token refreshed successfully.' });
  } catch (error) {
    return res.status(403).json({ status: 403, message: error.message });
  }
});

router.post('/login',validateSchema(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 400, message: 'Email and password are required.' });
  }

  try {
    const response = await loginUser({email, password});

    if (response.error) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: response.message });
    }

    const { accessToken, refreshToken } = response.tokens;


    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({ status: 200, message: 'Login successful.' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.body?.refreshToken;

  
  if (!refreshToken) {
    return res.status(400).json({ status: 400, message: 'Bad Request: Refresh token is required for logout.' });
  }

  try {
  
    let userId = req.user?.id;
    if (!userId) {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      userId = payload.id;
    }


    const response = await logoutUser({ userId, refreshToken });

    if (response.error) {
      return res.status(response.status || 500).json({ status: response.status || 500, message: response.message });
    }


    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ status: 200, message: 'Logout successful.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
