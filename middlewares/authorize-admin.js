const JWT = require('jsonwebtoken');
const Admin = require('../models/admin');

const unautorizeMessage = {
  status: 'error',
  statusCode: 401,
  message: 'Login to access this route.',
};

async function authorizeAdmin(req, res, next) {
  if (!req.headers['x-authorization'])
    return res.status(401).json(unautorizeMessage);

  const token = req.header('x-authorization').split(' ')[1];
  if (!token) return res.status(401).json(unautorizeMessage);

  try {
    const { user: decodedAdmin } = JWT.verify(token, process.env.JWT_SECRET);

    if (!decodedAdmin) return res.status(401).json(unautorizeMessage);
    const admin = await Admin.findOne({ email: decodedAdmin.email });

    if (!admin)
      return res.status(404).json({
        status: 'error',
        error: "Admin doesn't exist.",
        statusCode: 404,
      });

    if (admin.role !== 'Admin')
      return res.status(403).json({
        status: 'error',
        error: "You don't have permission to access this route.",
        statusCode: 403,
      });

    next(admin, req, res, next);
  } catch (error) {
    const err =
      error.name === 'TokenExpiredError'
        ? 'Session Expired. Please Login Again.'
        : 'Unauthorized.';

    return res
      .status(401)
      .json({ status: 'error', error: err, statusCode: 401 });
  }
}

module.exports = authorizeAdmin;
