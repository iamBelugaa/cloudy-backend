async function getDashboardDetails(user, req, res, next) {
  try {
    return res.status(200).json({
      status: 'ok',
      data: {
        displayName: user.displayName,
        email: user.email,
        ip: req.ip,
        activeFiles: user.activeFiles,
        activeStorage: user.activeStorage,
        totalEmailsSent: user.totalEmailsSent,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = getDashboardDetails;
