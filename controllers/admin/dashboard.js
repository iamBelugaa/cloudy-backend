const File = require('../../models/file');
const User = require('../../models/user');

async function userDashboardController(user, req, res, next) {
  try {
    const recentFiles = await File.find({})
      .sort('-createdAt')
      .limit(5)
      .select('uploaderInfo.email fileSize -_id')
      .lean()
      .exec();

    const recentUsers = await User.find({ role: { $ne: 'Admin' } })
      .sort('-createdAt')
      .limit(5)
      .select('displayName email -_id')
      .lean()
      .exec();

    return res.status(200).json({
      status: 'ok',
      data: {
        displayName: user.displayName,
        email: user.email,
        ip: req.ip,
        createdAt: user.createdAt,
        recentUsers,
        recentFiles,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = userDashboardController;
