const httpErrors = require('http-errors');
const { registrationValidation } = require('../../helpers/checkUserInput');
const { checkEmail } = require('../../helpers/findUserDetails');
const hashPassword = require('../../helpers/hashPassword');
const User = require('../../models/user');
const { generateAccessToken } = require('../../services/generateTokens');

async function registerUser(req, res, next) {
  try {
    const userDetails = {
      email: req.body.email,
      displayName: req.body.displayName,
      password: req.body.password,
    };

    if (!userDetails.email || !userDetails.displayName || !userDetails.password)
      return next(httpErrors.BadRequest('All fields are required.'));

    if (userDetails.email !== userDetails.email.toLowerCase())
      return next(httpErrors.BadRequest(`Email must be in Lowercase.`));

    const existEmail = await checkEmail(userDetails.email.trim());
    if (existEmail)
      return next(
        httpErrors.Conflict(`"${userDetails.email}" is already registered.`)
      );

    const validDetails = await registrationValidation(userDetails, next);
    if (validDetails) {
      const hashedPassword = await hashPassword(validDetails.password);

      const user = await User.create({
        email: validDetails.email,
        displayName: validDetails.displayName,
        password: hashedPassword,
      });

      const token = await generateAccessToken({
        id: user._id,
        email: user.email,
      });

      return res.status(200).json({
        status: 'ok',
        message: 'Account Registered.',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
          },
        },
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = registerUser;
