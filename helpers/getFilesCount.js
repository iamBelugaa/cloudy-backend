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
    const imagesCount = await getCount(fileExtensions.IMAGES_EXT);
    const videosCount = await getCount(fileExtensions.VIDEOS_EXT);
    const musicCount = await getCount(fileExtensions.MUSIC_EXT);
    const othersCount = await getCount(...fileExtensions.OTHER_EXT);

    return { imagesCount, videosCount, musicCount, othersCount };
  } catch (error) {
    throw error;
  }
};
