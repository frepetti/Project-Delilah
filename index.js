const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sequelize = require('./mysql');
const moment = require ('moment');

server.use(bodyParser.json());
server.listen('3000', () => console.log('Server iniciado'));

//Routes

const ordersRoutes = require('./routes/orders');
server.use('/orders', ordersRoutes);

const usersRoutes = require('./routes/users');
server.use('/users', usersRoutes);

const productRoutes = require('./routes/products');
server.use('/products', productRoutes);