const express = require('express');
const Router = express.Router();

const { createOrder, deleteOrder, getUserOrder, getAllOrders, income } = require('../controllers/orderController');

const { isAuth, isAdmin, isAuthorized } = require('../middleware/authorizationMiddlewares');

Router.post('/', isAuth, createOrder);
Router.get('/income', isAuth, isAdmin, income);
Router.get('/orders', isAuth, isAdmin, getAllOrders);
Router.delete('/:id', isAuth, isAdmin, deleteOrder);
Router.get('/:userId', isAuth, isAuthorized, getUserOrder);

module.exports = Router;
