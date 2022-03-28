const fileExtensions = require('./getExtensions');
const File = require('../models/file');

async function getCount(user, extensions) {
  try {
    return await File.find({
      'uploaderInfo.id': user._id,
      extension: {
        $in: extensions,
      },
    })
      .count()
      .exec();
  } catch (error) {
    throw error;
  }
}

module.exports = async function getFilesCount(user) {
  try {
    const imagesCount = await getCount(user, fileExtensions.IMAGES_EXT);
    const videosCount = await getCount(user, fileExtensions.VIDEOS_EXT);
    const musicCount = await getCount(user, fileExtensions.MUSIC_EXT);
    const othersCount = await File.find({
      'uploaderInfo.id': user._id,
      extension: {
        $nin: fileExtensions.OTHER_EXT,
      },
    })
      .count()
      .exec();

    return { imagesCount, videosCount, musicCount, othersCount };
  } catch (error) {
    throw error;
  }
};
