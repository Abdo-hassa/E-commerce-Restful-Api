const express = require('express');
const Router = express.Router();

const { login, register, Deactivate, Activate, refreshToken,resetPassword,newPassword } = require('../controllers/authController');
const { checkValidationErrors } = require('../utils/checkValidation');
const { isAuth } = require('../middleware/authorizationMiddlewares');
const { loginValidator, registerValidator } = require('../validation/authValidation');

Router.post('/register', registerValidator, checkValidationErrors, register);
Router.post('/login', loginValidator, checkValidationErrors, login);
Router.post('/reset', resetPassword);
Router.post('/newpass', newPassword);
Router.post('/deactivate', isAuth, Deactivate);
Router.post('/activate', isAuth, Activate);
Router.post('/refresh', isAuth, refreshToken);



module.exports = Router;
