const getFilesCount = require('../../helpers/getFilesCount');

async function getDashboardDetails(user, req, res, next) {
  try {
    const { imagesCount, videosCount, musicCount, othersCount } =
      await getFilesCount();

    return res.status(200).json({
      status: 'ok',
      data: {
        displayName: user.displayName,
        email: user.email,
        activeFiles: user.activeFiles,
        activeStorage: user.activeStorage,
        totalEmailsSent: user.totalEmailsSent,
        filesCount: {
          imagesCount,
          videosCount,
          musicCount,
          othersCount,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = getDashboardDetails;
