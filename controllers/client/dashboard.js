const { getRecentFiles } = require('./history');

async function getDashboardDetails(user, req, res, next) {
  try {
    return res.status(200).json({
      status: 'ok',
      data: {
        displayName: user.displayName,
        email: user.email,
        activeFiles: user.activeFiles,
        activeStorage: user.activeStorage,
        totalEmailsSent: user.totalEmailsSent,
        recentFiles: await getRecentFiles(user, req, res, next),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = getDashboardDetails;
