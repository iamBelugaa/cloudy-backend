const httpErrors = require('http-errors');
const {
  PasswordVerificationSchema,
} = require('../../services/userInputValidation');
const { generateAccessToken } = require('../../services/generateTokens');
const hashPassword = require('../../helpers/hashPassword');

async function changePassword(user, req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return next(httpErrors.BadRequest("Password fields cann't be empty."));

    if (currentPassword === newPassword)
      return next(httpErrors.BadRequest('New password must be differnt.'));

    const validNewPassword = await PasswordVerificationSchema.validateAsync({
      newPassword,
    });

    if (validNewPassword) {
      const isValidPassword = await user.checkPassword(currentPassword);

      if (!isValidPassword)
        return next(httpErrors.BadRequest('Invalid password.'));

      user.password = await hashPassword(validNewPassword.newPassword);
      await user.save();

      return res.status(200).json({
        status: 'ok',
        token: await generateAccessToken({ id: user._id, email: user.email }),
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = changePassword;
