const express = require('express');
const Router = express.Router();

const {
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	getAllProducts,
	productSearch,
} = require('../controllers/productController');
const { checkValidationErrors } = require('../utils/checkValidation');
const { createProductValidator } = require('../validation/productValidation');
const { isAuth, isAdmin } = require('../middleware/authorizationMiddlewares');

//Admins Routes
Router.post('/', isAuth, isAdmin, createProductValidator, checkValidationErrors, createProduct);
Router.post('/search', isAuth, productSearch);
Router.get('/products', getAllProducts);
Router.put('/:id', isAuth, isAdmin, updateProduct);
Router.delete('/:id', isAuth, isAdmin, deleteProduct);
Router.get('/:id', getProduct);

module.exports = Router;
