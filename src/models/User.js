const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		isAdmin: {
			type: Boolean,
			default: false,
		},
		resetToken: String,
		cart: {
			items: [
				{
					productid: {
						type: Schema.Types.ObjectId,
						ref: 'Product',
						required: true,
					},
					quantity: { type: Number, required: true },
				},
			],
		},
	},
	{ timestamps: true }
);

UserSchema.plugin(mongoose_delete);

UserSchema.pre('save', async function (next) {
	const user = this;
	const id = uuid.v4().slice(0, 4);
	const hashedPassword = await bcrypt.hash(user.password, 12);
	if (user.isModified('password')) user.password = hashedPassword;
	if (user.isModified('username')) user.username = user.username + id;
	next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
	const user = this;
	const id = uuid.v4().slice(0, 4);
	const hashedPassword = await bcrypt.hash(user._update['$set'].password, 12);
	if (user._update['$set'].username) user._update['$set'].username = user._update['$set'].username + id;
	if (user._update['$set'].password) user._update['$set'].password = hashedPassword;
	next();
});
UserSchema.methods.hidePrivateData = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

UserSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex(cp => {
		return cp.productid.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productid: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

UserSchema.methods.removeFromCart = function (productid) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productid.toString() !== productid.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};

UserSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', UserSchema);
