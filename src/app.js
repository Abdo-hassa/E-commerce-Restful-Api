const express = require('express');
const app = express();
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const ProductRoute = require('./routes/product');
const CartRoute = require('./routes/cart');
const OrderRoute = require('./routes/order');
const Stripe = require('./routes/stripe');

const cors = require('cors')

const { errorHandler, notFound } = require('./middleware/errorMiddlewares');
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.get('/', (req, res) => {
	res.send('api is running');
});
app.use(cors())
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/product', ProductRoute);
app.use('/api/cart', CartRoute);
app.use('/api/order', OrderRoute);
app.use('/api/checkout', Stripe);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
