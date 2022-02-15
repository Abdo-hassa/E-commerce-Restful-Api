const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const uuid = require('uuid');

/**
 * @desc     Create process
 * @route    POST /cart
 * @access   all users
 */
exports.createCart = asyncHandler(async (req, res, next) => {
	const CartData = req.body;
	const cart = await new Cart(CartData);
	await cart.save();
	res.status(201).json(cart);
});

/**
 * @desc     Update process
 * @route    PUT /cart/:id
 * @access   users and Admins
 */
exports.updateCart = asyncHandler(async (req, res, next) => {
	const cartId = req.params.id;
	const cart = await Cart.findByIdAndUpdate(cartId, { $set: req.body }, { new: true });
	if (!cart) {
		throw new ErrorHandler(401, 'there is no cart');
	}
	await cart.save();
	res.status(201).json({ message: 'updated', cart });
});

/**
 * @desc     Delelte process
 * @route    DELETE /cart/:id
 * @access   users and Admins
 */
exports.deleteCart = asyncHandler(async (req, res, next) => {
	const cartId = req.params.id;
	await Cart.findByIdAndDelete(cartId);
	res.status(201).json({ message: 'cart Delated' });
});

/**
 * @desc     Get process
 * @route    GET /cart/:userId
 * @access   users and Admins
 */
exports.getUserCart = asyncHandler(async (req, res, next) => {
	const userId = req.params.userId;
	const cart = await Cart.findOne({ userId: userId });
	res.status(201).json(cart);
});

/**
 * @desc     Get process
 * @route    GET /products
 * @access   Admins
 */
exports.getAllCart = asyncHandler(async (req, res, next) => {
	const carts = await Cart.find();
	res.status(200).json(carts);
});

/**
 * @desc     Get process
 * @route    GET /income
 * @access   Admins
 */


