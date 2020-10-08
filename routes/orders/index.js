const express = require('express');
const server = express();
const sequelize = require('./../../mysql');
const authMiddleware = require('./../../middlewares/auth');
const adminMiddleware = require('./../../middlewares/admin');
const config = require('./../../config');
const jwt = require("jsonwebtoken");

//Consultar todas las ordenes (admin)
server.get('/', authMiddleware, async(req,res) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1];
        const authData = jwt.verify(token, config.firma);
        console.log(authData);
        const user_role = authData.role;
        console.log(user_role);
        if (user_role === 'Admin') {
            const data = await sequelize.query(
                `SELECT order_status.status, client_orders.time, client_orders.id, payment_method.payment, products.description, products.price, users.name, users.last_name, users.address 
                FROM client_orders 
                JOIN users ON client_orders.user_id = users.id
                JOIN order_status on client_orders.status_id = order_status.id
                JOIN order_products ON client_orders.id = order_products.order_id
                JOIN payment_method ON client_orders.payment_id = payment_method.id
                JOIN products ON order_products.product_id = products.id
                `,
                {type: sequelize.QueryTypes.SELECT}
            )
            res.send(data);
        } else {
            const user_id = authData.user_id;
            console.log(user_id);
            const data = await sequelize.query(
                `SELECT order_status.status, client_orders.time, client_orders.id, payment_method.payment, products.description, products.price, users.name, users.last_name, users.address 
                FROM client_orders 
                JOIN users ON client_orders.user_id = users.id
                JOIN order_status on client_orders.status_id = order_status.id
                JOIN order_products ON client_orders.id = order_products.order_id
                JOIN payment_method ON client_orders.payment_id = payment_method.id
                JOIN products ON order_products.product_id = products.id
                WHERE user_id = ?
                `,
                { replacements: [ user_id ] , type: sequelize.QueryTypes.SELECT}
            )
            res.send(data);
        }

    } catch (error) {
        res.send(error);
    }
})



//Consultar una orden
server.get('/:id', authMiddleware, adminMiddleware, async(req,res) => {
    try {
        const data = await sequelize.query(
            `SELECT order_status.description, client_orders.time, client_orders.id, payment_method.description, products.description, products.price, users.name, users.last_name, users.address 
            FROM client_orders 
            JOIN users ON client_orders.user_id = users.id
            JOIN order_status on client_orders.status_id = order_status.id
            JOIN order_products ON client_orders.id = order_products.order_id
            JOIN payment_method ON client_orders.payment_id = payment_method.id
            JOIN products ON order_products.product_id = products.id
            WHERE client_orders.id = :id
            `,
            { replacements: { id: parseInt(req.params.id) }, type: sequelize.QueryTypes.SELECT}
        )
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

//Insertar una orden
server.post('/', authMiddleware, async(req,res) => {
    try {
        const { payment_id, product_id } = req.body;
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1];
        const authData = jwt.verify(token, config.firma);
        const user_id = authData.user_id;
        const paymentMethod = Object.values(req.body[0])[0];
        await sequelize.query(
            `INSERT into client_orders
                (user_id, payment_id, status_id)
            VALUES
                (?, ?, 1)
            `,
        { replacements: [ user_id, paymentMethod ] });

        const data = await sequelize.query(
            'SELECT MAX(id) FROM client_orders', 
            { type: sequelize.QueryTypes.SELECT });

        const last_order = Object.values(data[0])[0];
        async function insertProducts (product, i, array) {
            await sequelize.query(`
            INSERT INTO order_products
            (order_id, product_id)
            VALUES 
            (?, ?)`,
            { replacements: [last_order, product.product_id] });
        };
        req.body.forEach(insertProducts);
        res.status(200).send("Orden creada correctamente");
    } catch (err) {
        res.send(err);
    }
})

//Editar una orden
server.put('/:id', authMiddleware, adminMiddleware, async(req,res) => {
    try {
        const {status_id} = req.body;
        const id = req.params.id;
        await sequelize.query(
            `UPDATE client_orders SET status_id = ?
            WHERE id = ?
            `,
        { replacements: [ status_id, id ] }
        );
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(err);
    }
});

//Borrar una orden

server.delete('/:id', authMiddleware, adminMiddleware, async(req, res) => {

    try {
        await sequelize.query(
            `DELETE FROM client_orders WHERE id = :id`,
        { replacements: { id: parseInt(req.params.id) } }
        );
    
        res.sendStatus(200);
    } catch (err) {
        res.send(err);
    }

});





module.exports = server;