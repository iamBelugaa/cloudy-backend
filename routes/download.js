const express = require('express');
const Router = express.Router();

Router.get(
  '/file/:uuid',
  require('../controllers/client/download').getDownloadLink
);

Router.get(
  '/download/:uuid',
  require('../controllers/client/download').downloadFile
);

module.exports = Router;
