const httpErrors = require('http-errors');
const File = require('../../models/file');
const fs = require('fs');
const path = require('path');
const User = require('../../models/user');
const fileExtensions = require('../../helpers/getExtensions');

async function getFiles(user, extension, res) {
  try {
    const files = await File.find({
      'uploaderInfo.id': { $ne: user._id },
      extension: {
        $in: extension,
      },
    })
      .sort('-createdAt')
      .select('fileSize uuid uploaderInfo.email receiverInfo createdAt -_id')
      .lean()
      .exec();
    return res.status(200).json({ status: 'ok', files });
  } catch (error) {
    throw error;
  }
}

async function getImages(user, req, res, next) {
  try {
    return await getFiles(user, fileExtensions.IMAGES_EXT, res);
  } catch (error) {
    return next(error);
  }
}

async function getVideos(user, req, res, next) {
  try {
    return await getFiles(user, fileExtensions.IMAGES_EXT, res);
  } catch (error) {
    return next(error);
  }
}

async function getDocuments(user, req, res, next) {
  try {
    return await getFiles(user, fileExtensions.OTHERS_EXT, res);
  } catch (error) {
    return next(error);
  }
}

async function removeFile(user, req, res, next) {
  try {
    const { uuid } = req.body;
    if (!uuid) return next(httpErrors.BadRequest("File Doesn't Exist."));

    const file = await File.findOne({ uuid }).exec();
    if (!file) return next(httpErrors.BadRequest("File Doesn't Exist."));

    const deletedFileUser = await User.findOne({
      'email.address': file.uploaderInfo.email,
    });

    if (!deletedFileUser)
      return next(httpErrors.BadRequest('Error deleting file.'));

    if (fs.existsSync(path.join(__dirname, '../../', file.path)))
      fs.unlinkSync(path.join(__dirname, '../../', file.path));

    await deletedFileUser.decreaseFilesCountAndStorage(file.fileSize);
    await file.remove();

    return res.status(200).json({ status: 'ok', message: 'File Deleted.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getImages,
  getVideos,
  getDocuments,
  removeFile,
};
