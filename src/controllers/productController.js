const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const {generateCriteriaObject} = require('../helpers/helper')
const uuid = require('uuid');
const cloudinary = require('cloudinary');


/**
 * @desc     Create process
 * @route    POST /product
 * @access   Admins
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
	const data = await cloudinary.v2.uploader.upload(req.file.path);
	const productData = {
		...req.body,
		img:data.url
	};
	console.log(productData)
	const product = await new Product(productData);
	await product.save();
	res.status(201).json(product);
});

/**
 * @desc     Update process
 * @route    PUT /product/:id
 * @access   Admins
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
	const productId = req.params.id;
	let updateobj
	if(req.file){
		 updateobj = {
		  ...req.body,
			file: req.file
		}
	}else{
		updateobj = {
		 ...req.body,
	 };
	}
	const product = await Product.findByIdAndUpdate(productId, { $set: updateobj }, { new: true });
	if (!product) {
		throw new ErrorHandler(401, 'there is no product');
	}
	await product.save();
	res.status(201).json({ message: 'updated', product });
});

/**
 * @desc     Delelte process
 * @route    DELETE /product/:id
 * @access   Admins
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
	const productId = req.params.id;
	await Product.findByIdAndDelete(productId);
	res.status(201).json({ message: 'Product Delated' });
});

/**
 * @desc     Get process
 * @route    GET /product/:id
 * @access   Admins
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
	const productId = req.params.id;
	const product = await Product.findById(productId);
	res.status(201).json(product);
});

/**
 * @desc     Get process
 * @route    GET /products
 * @access   Admins
 */
exports.getAllProducts = asyncHandler(async (req, res, next) => {
	const qNew = req.query.new;
	const qcategory = req.query.category;
	let products;
	if (qNew) {
		products = await Product.find().sort({ _id: -1 }).limit(5);
	} else if (qcategory) {
		products = await Product.find({
			categories: { $in: [qcategory] },
		});
	}else{
    products = await Product.find()
  }
	res.status(200).json(products);
});

exports.productSearch = asyncHandler(async (req, res, next) => {
	const allDate = req.body
	const data = generateCriteriaObject(allDate)
	const matchedProduct = await Product.find(data)
	res.json(matchedProduct)
})