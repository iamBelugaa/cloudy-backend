const User = require('../models/user');
const Admin = require('../models/admin');

// **************** Check Email **************** //
async function checkEmail(email) {
  try {
    return await User.findOne({ email }).exec();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
}

// **************** Check Email Admin**************** //
async function checkEmailAdmin(email) {
  try {
    return await Admin.findOne({ email }).exec();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
}

module.exports = {
  checkEmail,
  checkEmailAdmin,
};
