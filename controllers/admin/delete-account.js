const httpErrors = require('http-errors');
const Admin = require('../../models/admin');

async function deleteUserAccount(user, req, res, next) {
  try {
    const adminCount = await Admin.find({}).count().exec();

    if (adminCount < 2)
      return next(
        httpErrors.BadRequest(
          "You cann't delete your account since you are the only Admin left."
        )
      );

    await user.remove();
    return res.status(200).json({
      status: 'ok',
      message: 'Account Deleted. Thank you for using our service.',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = deleteUserAccount;
