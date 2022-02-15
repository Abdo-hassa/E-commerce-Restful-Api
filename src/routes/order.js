const express = require('express');
const Router = express.Router();

const {
	createOrder,
	updateOrder,
	deleteOrder,
	getUserOrder,
	getAllOrders,
	income,
} = require('../controllers/orderController');

const { isAuth, isAuthorized, isAdmin } = require('../middleware/authorizationMiddlewares');

Router.post('/', isAuth, isAuthorized, createOrder);
//Admins Routes
Router.get('/income', isAuth, isAdmin, income);
Router.get('/orders', isAuth, isAdmin, getAllOrders);
Router.put('/:id', isAuth, isAdmin, updateOrder);
Router.delete('/:id', isAuth, isAdmin, deleteOrder);

Router.get('/:userId', isAuth, isAuthorized, getUserOrder);

module.exports = Router;
