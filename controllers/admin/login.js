const httpErrors = require('http-errors');
const { checkEmailAdmin } = require('../../helpers/findUserDetails');
const { loginValidation } = require('../../helpers/checkUserInput');
const { generateAccessToken } = require('../../services/generateTokens');

async function loginUser(req, res, next) {
  try {
    const AdminDetails = {
      email: req.body.email,
    };

    const isValidLoginDeatils = await loginValidation(AdminDetails, next);
    if (isValidLoginDeatils) {
      const admin = await checkEmailAdmin(isValidLoginDeatils.email, next);
      if (!admin)
        return next(httpErrors.Unauthorized('Invalid Login Details.'));

      const isValidPassword = await admin.checkPassword(req.body.password);
      if (!isValidPassword)
        return next(httpErrors.Unauthorized('Invalid Login Details.'));

      if (admin.role === 'Admin') {
        const token = await generateAccessToken({
          id: admin._id,
          email: admin.email,
        });

        return res.status(200).json({
          status: 'ok',
          token,
        });
      } else
        return next(
          httpErrors.Forbidden(
            "You don't have the permission to access this route."
          )
        );
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = loginUser;
