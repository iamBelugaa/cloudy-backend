const express = require('express');
const authorizeUser = require('../../middlewares/authorize-user');
const Router = express.Router();

/* -------------------Routes -----------------------*/
Router.get(
  '/dashboard',
  authorizeUser,
  require('../../controllers/client/dashboard')
);

Router.post(
  '/upload',
  authorizeUser,
  require('../../controllers/client/upload')
);

Router.post('/mail', authorizeUser, require('../../controllers/client/mail'));

Router.get(
  '/profile',
  authorizeUser,
  require('../../controllers/client/profile')
);

Router.post(
  '/change-info',
  authorizeUser,
  require('../../controllers/client/change-info')
);

Router.delete(
  '/remove-history',
  authorizeUser,
  require('../../controllers/client/history').removeHistory
);

Router.delete(
  '/delete-account',
  authorizeUser,
  require('../../controllers/client/delete-account')
);

Router.post(
  '/change-password',
  authorizeUser,
  require('../../controllers/client/change-password')
);

Router.get(
  '/images',
  authorizeUser,
  require('../../controllers/client/history').getImages
);

Router.get(
  '/videos',
  authorizeUser,
  require('../../controllers/client/history').getVideos
);

Router.get(
  '/documents',
  authorizeUser,
  require('../../controllers/client/history').getDocuments
);

Router.post(
  '/delete-file',
  authorizeUser,
  require('../../controllers/client/history').removeFile
);

module.exports = Router;
