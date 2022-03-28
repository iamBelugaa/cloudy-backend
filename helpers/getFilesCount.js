const fileExtensions = require('./getExtensions');
const File = require('../models/file');

async function getCount(extensions, operator = '$in') {
  try {
    return await File.find({
      'uploaderInfo.id': user._id,
      extension: {
        operator: extensions,
      },
    })
      .count()
      .exec();
  } catch (error) {
    throw error;
  }
}

module.exports = async function getFilesCount() {
  try {
    const imagesCount = await getCount(fileExtensions.IMAGES_EXT);
    const videosCount = await getCount(fileExtensions.VIDEOS_EXT);
    const musicCount = await getCount(fileExtensions.MUSIC_EXT);
    const othersCount = await getCount(
      [
        ...fileExtensions.IMAGES_EXT,
        ...fileExtensions.VIDEOS_EXT,
        ...fileExtensions.MUSIC_EXT,
      ],
      '$nin'
    );

    return { imagesCount, videosCount, musicCount, othersCount };
  } catch (error) {
    throw error;
  }
};
