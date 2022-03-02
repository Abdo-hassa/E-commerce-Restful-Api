const express = require('express');
const Router = express.Router();

const { updateUser, deleteUser, getUser, getAllUsers, getStats } = require('../controllers/userController');

const { isAuth, isAuthorized, isAdmin } = require('../middleware/authorizationMiddlewares');

//Admins Routes
Router.get('/users', isAuth, isAdmin, getAllUsers);
Router.get('/stats', isAuth, isAdmin, getStats);

Router.put('/:id', isAuth, isAuthorized, updateUser);
Router.delete('/:id', isAuth, isAdmin, deleteUser);
Router.get('/:id', isAuth, isAuthorized, getUser);

module.exports = Router;
