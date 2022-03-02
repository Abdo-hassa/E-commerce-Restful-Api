const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ProductSchema = new mongoose.Schema(
	{
		title: { type: String, required: true ,unique: true, index: true },
		desc: { type: String, required: true ,unique: false},
		img: { type: String, required: true ,unique: false},
		categories: { type: Array },
		size: { type: String },
		color: { type: String },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);
// ProductSchema.set('autoIndex', false);
ProductSchema.index({ "title": "text" })
module.exports = mongoose.model('Product', ProductSchema);
