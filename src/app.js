const express = require('express');
const app = express();
const multer = require('multer');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const ProductRoute = require('./routes/product');
const cloudinary = require('cloudinary');
const CartRoute = require('./routes/cart');
const OrderRoute = require('./routes/order');
const Stripe = require('./routes/stripe');

const cors = require('cors');
app.use(cors());
var storage = multer.diskStorage({});

const { errorHandler, notFound } = require('./middleware/errorMiddlewares');
app.use(express.json());

cloudinary.config({
	cloud_name: 'ecommerce-resto',
	api_key: process.env.Cloudinary_API,
	api_secret: process.env.Cloudinary_Secret_API,
});
app.use(multer({ storage: storage }).single('img'));

app.get('/', (req, res) => {
	res.send('api is running');
});
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/product', ProductRoute);
app.use('/api/cart', CartRoute);
app.use('/api/order', OrderRoute);
app.use('/api/checkout', Stripe);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
