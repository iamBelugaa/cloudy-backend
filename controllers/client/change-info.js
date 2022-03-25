const httpErrors = require('http-errors');
const {
  displayNameVerificationSchema,
  emailVerificationSchema,
} = require('../../services/userInputValidation');
const { checkEmail } = require('../../helpers/findUserDetails');

async function changeUserInformation(user, req, res, next) {
  try {
    const { displayName, email } = req.body;

    if (!displayName && !email)
      return next(httpErrors.BadRequest('Atleast one field is required.'));

    if (displayName || email) {
      if (user.email === email)
        return next(
          httpErrors.BadRequest(
            'Email must be different from your current email.'
          )
        );

      if (user.displayName === displayName)
        return next(
          httpErrors.BadRequest(
            'Username must be different from your current username.'
          )
        );

      if (await checkEmail(email))
        return next(httpErrors.BadRequest('Email is already registered.'));
    }

    let validDisplayName, validEmail;

    if (displayName)
      validDisplayName = await displayNameVerificationSchema.validateAsync({
        displayName,
      });

    if (email)
      validEmail = await emailVerificationSchema.validateAsync({ email });

    if (validDisplayName || validEmail) {
      await user.changeInformation({
        username: validDisplayName?.displayName || user.displayName,
        email: validEmail?.email || user.email,
      });

      return res.status(200).json({
        status: 'ok',
        message: 'Information Updated.',
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = changeUserInformation;
