const roles = require('../data/roles');
const School = require('../model/school.model'); 

// error if 
// 1. if role name not there in the role data
// 2. permission not there for this role
// 3. if schooladmin and if schoolID not present 
// 4. if schooladmin and if there is no school in DB with the schoolID
// 5. if schooladmin and if the school with the given schoolID does'nt have the schooladmin registered in the DB
// 6. if SUPERADMIN then just check for role data if granted then good to go

const authorizeRole = (resource, action) => (req, res, next) => {
  const userRole = req.user.role;
  const userSchoolId = req.user.schoolId; 
  const { schoolId } = req.query || req.body; 

  const roleDetails = roles.find((role) => role.roleName === userRole);
  if (!roleDetails) {
    return res.status(403).json({ message: 'Role not found. Access Forbidden.' });
  }

  const permissions = roleDetails.permissions[resource];
  if (!permissions || !permissions.includes(action)) {
    return res.status(403).json({
      message: `Access Forbidden. Permission '${action}' not granted for ${resource}.`,
    });
  }

  if (userRole === 'SchoolAdmin') {
    if (!schoolId) {
      return res.status(400).json({ message: 'Bad Request: schoolId is required.' });
    }

    if (schoolId.toString() !== userSchoolId.toString()) {
      return res.status(403).json({
        message: 'Access Forbidden. You are not authorized to manage this school.',
      });
    }
  }

  next();
};



module.exports = { authorizeRole };
