const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const uuid = require('uuid');

/**
 * @desc     Create process
 * @route    POST /order
 * @access   all users
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
	const orderData = req.body;
	const order = await new Order(orderData);
	await order.save();
	res.status(201).json(order);
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
		throw new ErrorHandler(401, 'there is no order');
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
	res.status(201).json({ message: 'Order Delated' });
});

/**
 * @desc     Get process
 * @route    GET /order/:userId
 * @access   users and Admins
 */
exports.getUserOrder = asyncHandler(async (req, res, next) => {
	const userId = req.params.userId;
	const order = await Order.findOne({ userId: userId });
	res.status(201).json(order);
});

/**
 * @desc     Get process
 * @route    GET /order
 * @access   Admins
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
	const orders = await Order.find();
	res.status(200).json(orders);
});

exports.income = asyncHandler(async (req, res, next) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	const income = await Order.aggregate([
		{ $match: { createdAt: { $gte: previousMonth } } },
		{
			$project: {
				month: { $month: '$createdAt' },
				sales: '$amount',
			},
		},
		{
			$group: {
				_id: '$month',
				total: { $sum: '$sales' },
			},
		},
	]);
	res.status(200).json(income);
});
