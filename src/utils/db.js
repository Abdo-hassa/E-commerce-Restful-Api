const mongoose = require('mongoose');
const { ErrorHandler } = require('../helpers/ErrorHandler');
mongoose.set('runValidators', true);
exports.connectDB = () => {
	try {
		return mongoose.connect(process.env.MONGO_URI,{ autoIndex: false }, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (e) {
		throw new ErrorHandler(500, `Error: ${e.message}`);
	}
};
