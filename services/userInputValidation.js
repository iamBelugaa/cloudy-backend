const JOI = require('joi');

const registrationValidationSchema = JOI.object({
  email: JOI.string().email().trim().lowercase().required(),
  displayName: JOI.string().min(3).max(20).trim().lowercase().required(),
  password: JOI.string().min(5).max(20).trim().required(),
});

const emailVerificationSchema = JOI.object({
  email: JOI.string().email().trim().lowercase().required(),
});

const displayNameVerificationSchema = JOI.object({
  displayName: JOI.string().min(3).max(20).trim().lowercase().required(),
});

const PasswordVerificationSchema = JOI.object({
  newPassword: JOI.string().min(5).trim().max(20).required(),
});

module.exports = {
  registrationValidationSchema,
  emailVerificationSchema,
  displayNameVerificationSchema,
  PasswordVerificationSchema,
};
