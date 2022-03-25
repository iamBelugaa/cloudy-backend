const express = require('express');
const Router = express.Router();

/* ----------------- Routes ----------------- */
Router.post('/login', require('../../controllers/admin/login'));

module.exports = Router;
