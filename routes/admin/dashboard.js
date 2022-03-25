const express = require('express');
const Router = express.Router();
const authorizeAdmin = require('../../middlewares/authorize-admin');

/* ---------------- Routes -------------------- */
Router.get(
  '/dashboard',
  authorizeAdmin,
  require('../../controllers/admin/dashboard')
);

Router.post(
  '/change-password',
  authorizeAdmin,
  require('../../controllers/admin/change-password')
);

Router.post(
  '/change-info',
  authorizeAdmin,
  require('../../controllers/admin/change-info')
);

Router.delete(
  '/delete-account',
  authorizeAdmin,
  require('../../controllers/admin/delete-account')
);

Router.get(
  '/profile',
  authorizeAdmin,
  require('../../controllers/client/profile')
);

Router.get(
  '/users',
  authorizeAdmin,
  require('../../controllers/admin/manage-users').getAllUsers
);

Router.post(
  '/remove-user',
  authorizeAdmin,
  require('../../controllers/admin/manage-users').deleteUserAccount
);

Router.get(
  '/admins',
  authorizeAdmin,
  require('../../controllers/admin/manage-admins').getAllAdmins
);

Router.post(
  '/remove-admin',
  authorizeAdmin,
  require('../../controllers/admin/manage-admins').deleteAdminAccount
);

Router.post(
  '/add-admin',
  authorizeAdmin,
  require('../../controllers/admin/manage-admins').addAdminAccount
);

Router.get(
  '/images',
  authorizeAdmin,
  require('../../controllers/admin/manage-files').getImages
);

Router.get(
  '/videos',
  authorizeAdmin,
  require('../../controllers/admin/manage-files').getVideos
);

Router.get(
  '/documents',
  authorizeAdmin,
  require('../../controllers/admin/manage-files').getDocuments
);

Router.post(
  '/remove-file',
  authorizeAdmin,
  require('../../controllers/admin/manage-files').removeFile
);

module.exports = Router;
