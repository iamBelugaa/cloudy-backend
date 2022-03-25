const httpErrors = require('http-errors');
const {
  emailVerificationSchema,
} = require('../../services/userInputValidation');
const User = require('../../models/user');
const File = require('../../models/file');
const fs = require('fs');
const path = require('path');

async function getAllUsers(user, req, res, next) {
  try {
    const users = await User.find({
      _id: { $ne: user._id },
    })
      .sort('-updatedAt')
      .select('displayName email activeStorage activeFiles createdAt -_id')
      .exec();

    return res.status(200).json({
      status: 'ok',
      users,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUserAccount(user, req, res, next) {
  try {
    const { email } = req.body;

    if (!email) return next(httpErrors.BadRequest('Email Must Be Provided.'));
    if (email === user.email.address)
      return next(
        httpErrors.BadRequest('To Delete Your Account Go To Settings Tab.')
      );

    const validEmail = await emailVerificationSchema.validateAsync({ email });
    if (validEmail) {
      const userToDelete = await User.findOne({
        email: validEmail.email,
      });

      if (!userToDelete)
        return next(httpErrors.BadRequest("User doesn't exist."));

      if (userToDelete.role === 'Admin')
        return next(httpErrors.BadRequest("Cann't delete account."));

      const filesToDelete = await File.find({
        'uploaderInfo.id': userToDelete._id,
      })
        .select('path')
        .exec();

      filesToDelete.forEach(async (file) => {
        try {
          if (fs.existsSync(path.join(__dirname, '../../', file.path)))
            fs.unlinkSync(path.join(__dirname, '../../', file.path));
          await file.remove();
        } catch (error) {
          console.error(error);
          return next(httpErrors.InternalServerError('Something went wrong.'));
        }
      });

      await userToDelete.remove();
      return res.status(200).json({
        status: 'ok',
        message: `User account deleted and ${filesToDelete.length} file(s) were removed.`,
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllUsers, deleteUserAccount };
