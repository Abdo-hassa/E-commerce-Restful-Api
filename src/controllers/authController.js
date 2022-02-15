const User = require('../models/User');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/JWTService');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { verifyToken } = require('../utils/JWTService');

/**
 * @desc     Register process
 * @route    POST /auth/register
 * @access   public
 */
exports.register = asyncHandler(async (req, res, next) => {
	let { email, password, username } = req.body;
	const Userdata = {
		username,
		email,
		password,
	};
	let user = new User(Userdata);
	await user.save();
	res.status(201).json({ status: 'success', SavedUser: user.hidePrivateData() });
});

/**
 * @desc     Login process
 * @route    POST /auth/login
 * @access   public
 */
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: email });

	if (!user) {
		throw new ErrorHandler(401, 'This User is not Exist');
	}

	const isEqual = await bcrypt.compare(password, user.password);
	if (!isEqual) {
		throw new ErrorHandler(401, 'Wrong password');
	}
	const payload = { email: user.email, _id: user._id };
	const { accessToken, refreshToken } = generateToken(payload);

	res
		.status(200)
		.json({ status: 'success', user: { accessToken: accessToken, refreshToken: refreshToken, _id: user._id } });
});
