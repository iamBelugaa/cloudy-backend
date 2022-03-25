const bcrypt = require('bcryptjs');

module.exports = async function hashPassword(password) {
  try {
    return bcrypt.hash(password, 13);
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later...!!!');
  }
};
