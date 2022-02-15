const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);
UserSchema.pre('save', async function (next) {
	const user = this;
	const id = uuid.v4().slice(0, 4);
	const hashedPassword = await bcrypt.hash(user.password, 12);
	user.password = hashedPassword;
	user.username = user.username + id;
	next();
});

UserSchema.methods.hidePrivateData = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
};
module.exports = mongoose.model('User', UserSchema);
