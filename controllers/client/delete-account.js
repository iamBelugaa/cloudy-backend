const httpErrors = require('http-errors');
const File = require('../../models/file');
const fs = require('fs');
const path = require('path');

async function deleteUserAccount(user, req, res, next) {
  try {
    const filesToDelete = await File.find({
      'uploaderInfo.id': user._id,
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

    await user.remove();
    return res.status(200).json({
      status: 'ok',
      message: `Account Deleted. Thank you for using our service.`,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = deleteUserAccount;
