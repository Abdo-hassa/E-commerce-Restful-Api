const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const uuid = require('uuid');

/**
 * @desc     add to cart process
 * @route    POST /cart/addcart
 * @access   all users
 */
 exports.addToCart = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const productId = req.params.productId;
	const product = await Product.findById(productId);
	user.addToCart(product);
	res.status(201).json({ message: 'Added to cart' });
});

/**
 * @desc     Delete form cart process
 * @route    DELETE /cart/dfromcart
 * @access   users and Admins
 */
 exports.deleteFromCart = asyncHandler(async (req, res, next) => {
	const productId = req.body.productId;
	req.user.removeFromCart(productId);
	res.status(200).json({ message: 'Deleted' });
});

/**
 * @desc     Get process
 * @route    GET /usercart
 * @access   users
 */
 exports.getUserCart = asyncHandler(async (req, res, next) => {
	const userid = req.user._id.toString();
	const user = await User.findById(userid).populate('cart.items.productid');
	const products = user.cart.items;
	res.status(201).json(products);
});



