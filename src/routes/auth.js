const express = require('express');
const Router = express.Router();

const { login, register } = require('../controllers/authController');
const { checkValidationErrors } = require('../utils/checkValidation');

const { loginValidator, registerValidator } = require('../validation/authValidation');

Router.post('/register', registerValidator, checkValidationErrors, register);
Router.post('/login', loginValidator, checkValidationErrors, login);

module.exports = Router;
