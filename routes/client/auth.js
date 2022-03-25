const express = require('express');
const Router = express.Router();

/* -------------- Routes ------------------ */
Router.post('/register', require('../../controllers/client/register'));

Router.post('/login', require('../../controllers/client/login'));

module.exports = Router;
