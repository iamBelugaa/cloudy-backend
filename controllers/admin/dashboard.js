function userDashboardController(user, req, res, next) {
  return res.status(200).json({
    status: 'ok',
    data: {
      displayName: user.displayName,
      email: user.email,
    },
  });
}

module.exports = userDashboardController;
