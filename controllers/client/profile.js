async function userSettings(user, req, res, next) {
  try {
    return res.status(200).json({
      status: 'ok',
      data: {
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = userSettings;
