const express = require('express');
const Router = express.Router();

const { addToCart, deleteFromCart, getUserCart } = require('../controllers/cartController');

const { isAuth, isAdmin } = require('../middleware/authorizationMiddlewares');

//Admins Routes
Router.post('/addcart/:productId', isAuth, addToCart);
Router.get('/', isAuth, getUserCart);
Router.delete('/dfromcart', isAuth, deleteFromCart);

module.exports = Router;
