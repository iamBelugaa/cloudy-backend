const httpErrors = require('http-errors');
const File = require('../../models/file');
const fs = require('fs');
const path = require('path');
const fileExtensions = require('../../helpers/getExtensions');
const paginate = require('../../helpers/pagination');

async function getFiles(user, extensions, res) {
  try {
    const files = await File.find({
      'uploaderInfo.id': user._id,
      extension: {
        $in: extensions,
      },
    })
      .sort('-createdAt')
      .select('originalName fileSize extension createdAt uuid -_id')
      .lean()
      .exec();

    return res.status(200).json({ status: 'ok', files });
  } catch (error) {
    throw error;
  }
}

async function getRecentFiles(user, req, res, next) {
  try {
    const files = await File.find({
      'uploaderInfo.id': user._id,
    })
      .sort('-createdAt')
      .limit(10)
      .select('originalName fileSize extension createdAt uuid -_id')
      .lean()
      .exec();
    return res.status(200).json({ status: 'ok', files });
  } catch (error) {
    return next(error);
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
    return await getFiles(user, fileExtensions.VIDEOS_EXT);
  } catch (error) {
    return next(error);
  }
}

async function getMusic(user, req, res, next) {
  try {
    return await getFiles(user, fileExtensions.MUSIC_EXT, res);
  } catch (error) {
    return next(error);
  }
}

async function getOtherFiles(user, req, res, next) {
  try {
    const files = await File.find({
      'uploaderInfo.id': user._id,
      extension: {
        $nin: fileExtensions.OTHER_EXT,
      },
    })
      .sort('-createdAt')
      .select('originalName fileSize extension createdAt uuid -_id')
      .lean()
      .exec();

    return res.status(200).json({ status: 'ok', files });
  } catch (error) {
    return next(error);
  }
}

async function getAllFiles(user, req, res, next) {
  try {
    const files = await File.find({
      'uploaderInfo.id': user._id,
    })
      .sort('-createdAt')
      .select('originalName fileSize extension createdAt uuid -_id')
      .lean()
      .exec();
    return res.status(200).json({ status: 'ok', files });
  } catch (error) {
    return next(error);
  }
}

async function removeFile(user, req, res, next) {
  try {
    const { uuid } = req.body;

    if (!uuid) return next(httpErrors.BadRequest('Bruh just move on.'));

    const file = await File.findOne({
      uuid,
      'uploaderInfo.id': user._id,
    }).exec();

    if (!file) return next(httpErrors.BadRequest("File Doesn't Exist."));

    if (fs.existsSync(path.join(__dirname, '../../', file.path)))
      fs.unlinkSync(path.join(__dirname, '../../', file.path));

    await user.decreaseFilesCountAndStorage(file.fileSize);
    await file.remove();
    return res.status(200).json({ status: 'ok', message: 'File Deleted.' });
  } catch (error) {
    return next(error);
  }
}

async function removeHistory(user, req, res, next) {
  try {
    const filesToDelete = await File.find({
      'uploaderInfo.id': user._id,
    })
      .select('path fileSize -_id')
      .lean()
      .exec();

    if (filesToDelete?.length === 0)
      return res
        .status(200)
        .json({ status: 'ok', message: 'No History Found.' });

    await File.deleteMany({
      'uploaderInfo.id': user._id,
    }).exec();

    let fileSize = 0;
    filesToDelete.forEach(async (file) => {
      try {
        fileSize += file.fileSize;
        if (fs.existsSync(path.join(__dirname, '../../', file.path)))
          fs.unlinkSync(path.join(__dirname, '../../', file.path));
      } catch (error) {
        return next(httpErrors.InternalServerError('Error deleting files.'));
      }
    });

    await user.decreaseFilesCountAndStorage(fileSize, filesToDelete.length);
    return res.status(200).json({
      status: 'ok',
      message: `${filesToDelete.length} ${
        filesToDelete.length === 1 ? 'file was' : 'files were'
      } removed.`,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  removeHistory,
  getImages,
  getVideos,
  getMusic,
  getOtherFiles,
  removeFile,
  getRecentFiles,
  getAllFiles,
};
