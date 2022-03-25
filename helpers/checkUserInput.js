const {
  registrationValidationSchema,
  emailVerificationSchema,
} = require('../services/userInputValidation');

// ----------------- Registration Validation ----------------- //
async function registrationValidation(userDeatils) {
  try {
    return registrationValidationSchema.validateAsync(userDeatils);
  } catch (error) {
    throw error;
  }
}

// ----------------- Login Validation ----------------- //
async function loginValidation(userDeatils) {
  try {
    return emailVerificationSchema.validateAsync(userDeatils);
  } catch (error) {
    throw error;
  }
}

module.exports = { registrationValidation, loginValidation };
