const mongoose = require('mongoose');
const { ErrorHandler } = require('../helpers/ErrorHandler');
require('dotenv').config();
exports.connectDB = () => {
	try {
		return mongoose.connect(
			process.env.MONGO_URI_server,
			{ autoIndex: false },
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
	} catch (e) {
		throw new ErrorHandler(500, `Error: ${e.message}`);
	}
};
