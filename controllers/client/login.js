const httpErrors = require('http-errors');
const { generateAccessToken } = require('../../services/generateTokens');
const { checkEmail } = require('../../helpers/findUserDetails');
const { loginValidation } = require('../../helpers/checkUserInput');

async function loginUser(req, res, next) {
  try {
    const isValidLoginDeatils = await loginValidation(
      { email: req.body.email },
      next
    );

    if (isValidLoginDeatils) {
      const user = await checkEmail(isValidLoginDeatils.email, next);
      if (!user) return next(httpErrors.Unauthorized('Invalid Login Details.'));

      const isValidPassword = await user.checkPassword(req.body.password);
      if (!isValidPassword)
        return next(httpErrors.Unauthorized('Invalid Login Details.'));

      if (user.role === 'User')
        return res.status(200).json({
          status: 'ok',
          data: {
            token: await generateAccessToken({
              id: user._id,
              email: user.email,
            }),
            user: {
              id: user.id,
              email: user.email,
              displayName: user.displayName,
            },
          },
        });
      else
        return res.status(403).json({
          status: 'error',
          message: "You don't have the permission to access this route.",
        });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = loginUser;
