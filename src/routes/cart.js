const express = require('express');
const Router = express.Router();

const { createCart, updateCart, deleteCart, getUserCart, getAllCart } = require('../controllers/cartController');

const { isAuth, isAuthorized, isAdmin } = require('../middleware/authorizationMiddlewares');

//Admins Routes
Router.post('/', createCart);
Router.get('/carts', isAuth, isAdmin, getAllCart);
Router.put('/:id', isAuth, isAuthorized, updateCart);
Router.delete('/:id', isAuth, isAuthorized, deleteCart);
Router.get('/:userId', isAuth, isAuthorized, getUserCart);

module.exports = Router;
