const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const User = require('../models/User');
const { verifyToken } = require('../utils/JWTService');

exports.isAuth = asyncHandler(async (req, res, next) => {
	if (!req.headers?.authorization && !req.headers?.authorization?.startsWith('Bearer')) {
		throw new ErrorHandler(401, 'Not authenticated');
	} else {
		try {
			const token = req.headers.authorization.split(' ')[1];
			let decodedToken = verifyToken(token);
			let user = await User.findById(decodedToken.userId);
			req.user = user;
			next();
		} catch (e) {
			throw new ErrorHandler(401, 'Invalid token.');
		}
	}
});
