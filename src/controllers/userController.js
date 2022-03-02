const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const uuid = require('uuid');

/**
 * @desc     Update process
 * @route    PUT /user/:id
 * @access   users or admins
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true },);
	if (!user) {
		throw new ErrorHandler(401, 'there is no user');
	}

  // let updatedUser =  await user.save();
	res.status(201).json({ message: 'updated', user });
});

/**
 * @desc     Delete process
 * @route    DELETE /user/:id
 * @access   users or admins
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	await User.findByIdAndDelete(userId);
	res.status(201).json({ message: 'UserDelated' });
});

/**
 * @desc     Get process
 * @route    GET /user/:id
 * @access   users or admins
 */
exports.getUser = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;
	const user = await User.findById(userId);
	res.status(201).json({ user: user.hidePrivateData() });
});

/**
 * @desc     Get process
 * @route    GET /users
 * @access   Admins
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	const query = req.query.new;
	const users = query ? await User.find({}).sort({ id: -1 }).limit(5) : await User.find();
	res.status(200).json(users);
});

/**
 * @desc     Get process
 * @route    GET /stats
 * @access   Admins
 */
exports.getStats = asyncHandler(async (req, res, next) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	const data = await User.aggregate([
		{
			$match: { createdAt: { $gte: lastYear } },
		},
		{ $project: { month: { $month: '$createdAt' } } },
		{
			$group: {
				_id: '$month',
				total: { $sum: 1 },
			},
		},
	]);
	res.status(200).json(data);
});
