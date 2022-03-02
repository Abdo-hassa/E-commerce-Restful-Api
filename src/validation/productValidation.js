const { body, check } = require('express-validator');
const Product = require('../models/Product');

exports.createProductValidator = [
	check('title')
		.exists()
		.custom((value, { req }) => {
			return Product.findOne({ title: value }).then(productDoc => {
				if (productDoc) {
					return Promise.reject('this Product is already exist');
				}
				return true;
			});
		}),
];
