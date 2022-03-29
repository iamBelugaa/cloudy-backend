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
  '/delete-account',
  authorizeUser,
  require('../../controllers/client/delete-account')
);

Router.post(
  '/change-password',
  authorizeUser,
  require('../../controllers/client/change-password')
);

Router.delete(
  '/clear-storage',
  authorizeUser,
  require('../../controllers/client/files-history').removeHistory
);

Router.get(
  '/recent-files',
  authorizeUser,
  require('../../controllers/client/files-history').getRecentFiles
);

Router.get(
  '/images',
  authorizeUser,
  require('../../controllers/client/files-history').getImages
);

Router.get(
  '/videos',
  authorizeUser,
  require('../../controllers/client/files-history').getVideos
);

Router.get(
  '/music',
  authorizeUser,
  require('../../controllers/client/files-history').getMusic
);

Router.get(
  '/others',
  authorizeUser,
  require('../../controllers/client/files-history').getOtherFiles
);

Router.delete(
  '/delete-file',
  authorizeUser,
  require('../../controllers/client/files-history').removeFile
);

module.exports = Router;
