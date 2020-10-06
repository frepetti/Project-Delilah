const express = require('express');
const server = express();
const sequelize = require('./../../mysql');
const moment = require('moment');

//Consultar ordenes
server.get('/', async(req,res) => {
    try {
        const data = await sequelize.query(
            `SELECT order_status.description, client_orders.time, client_orders.id, payment_method.description, order_products.subtotal, users.name, users.last_name, users.address 
            FROM client_orders 
            JOIN users ON client_orders.user_id = users.id
            JOIN order_status on client_orders.status_id = order_status.id
            JOIN order_products ON client_orders.id = order_products.order_id
            JOIN payment_method ON client_orders.payment_id = payment_method.id`,
            {type: sequelize.QueryTypes.SELECT}
        )
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

//Insertar una orden
server.post('/', async(req,res) => {
    try {
        const { user_id, payment_id, status_id } = req.body;
        await sequelize.query(
            `INSERT into client_orders
                (user_id, payment_id, status_id)
            VALUES
                (?, ?, ?)
            `,
        { replacements: [ user_id, payment_id, status_id ] }
        );  
    } catch (err) {
        res.send(err);
    }
})




module.exports = server;