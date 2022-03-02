const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const uuid = require('uuid');

/**
 * @desc     Create process
 * @route    POST /order
 * @access   all users
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
	const userid = req.user._id.toString();
	const user = await User.findById(userid).populate('cart.items.productid');
	const products = user.cart.items.map(i => {
		return {
			quantity: i.quantity,
			product: { ...i.productid._doc },
		};
	});
	if (products.length === 0) {
		throw new ErrorHandler(422, 'there is no products in your cart');
	}
	let TotalPrice = 0;
	for (var p of products) {
		TotalPrice = TotalPrice + p.product.price * p.quantity;
	}
	const order = await new Order({
		userId: req.user,
		products: products,
		TotalPrice: TotalPrice,
		address: req.body.address,
	});
	order.save();
	req.user.clearCart();
	res.json({ message: 'Orderd' });
});
/**
 * @desc     Get process
 * @route    GET /order/:userId
 * @access   users and Admins
 */
exports.getUserOrder = asyncHandler(async (req, res, next) => {
	const userId = req.params.userId;
	const order = await Order.findOne({ userId: userId }).populate('userId');
	res.status(201).json(order);
});

/**
 * @desc     Get process
 * @route    GET /orders
 * @access   Admins
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
	const orders = await Order.find().populate('userId');
	res.status(200).json(orders);
});

/**
 * @desc     Update process
 * @route    PUT /order/:id
 * @access   Admins
 */
exports.updateOrder = asyncHandler(async (req, res, next) => {
	const orderId = req.params.id;
	const order = await Order.findByIdAndUpdate(orderId, { $set: req.body }, { new: true });
	if (!order) {
		throw new ErrorHandler(422, 'there is no order');
	}
	await order.save();
	res.status(201).json({ message: 'updated', order });
});

/**
 * @desc     Delelte process
 * @route    DELETE /order/:id
 * @access    Admins
 */
exports.deleteOrder = asyncHandler(async (req, res, next) => {
	const orderId = req.params.id;
	await Order.findByIdAndDelete(orderId);
	res.status(201).json({ message: 'Order Deleted' });
});


/**
 * @desc     Income process
 * @route    DELETE /order/income
 * @access    Admins
 */
exports.income = asyncHandler(async (req, res, next) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	const income = await Order.aggregate([
		{ $match: { createdAt: { $gte: previousMonth } } },
		{
			$project: {
				month: { $month: '$createdAt' },
				sales: '$TotalPrice',
			},
		},
		{
			$group: {
				_id: '$month',
				total_Income: { $sum: '$sales' },
			},
		},
	]);
	res.status(200).json(income);
});
