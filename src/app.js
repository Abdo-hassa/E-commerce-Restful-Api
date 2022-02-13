const express = require('express');
const app = express();
const AuthRoute = require("./routes/auth")
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


app.use('/api/auth',AuthRoute)

app.use(errorHandler)
app.use(notFound)




module.exports = app
