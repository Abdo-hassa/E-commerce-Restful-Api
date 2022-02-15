const express = require('express');
const Router = express.Router();

const {
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	getAllProducts,
} = require('../controllers/productController');

const { isAuth, isAuthorized, isAdmin } = require('../middleware/authorizationMiddlewares');

//Admins Routes
Router.post('/', isAuth, isAdmin, createProduct);
Router.get('/products', getAllProducts);
Router.put('/:id', isAuth, isAuthorized, updateProduct);
Router.delete('/:id', isAuth, isAuthorized, deleteProduct);
Router.get('/:id', isAuth, isAuthorized, getProduct);

module.exports = Router;
