const express = require('express');
const server = express();
const sequelize = require('./../../mysql');

//Consultar productos activos

server.get('/', async(req,res) => {
    try {
        const data = await sequelize.query(
            'SELECT * from products WHERE active = 1',
            {type: sequelize.QueryTypes.SELECT}
        )
        res.send(data);
    } catch(err){
        res.send(err);
    }
});

//Insertar un producto

server.post('/', async(req,res) => {
    try {
        const {description, price, picture, price_discount, active } = req.body;
        await sequelize.query(
            `INSERT INTO products   
                (description, price, picture, price_discount,active)
            VALUES
                (?, ?, ?, ?, ?)
            `,
        { replacements: [ description, price, picture, price_discount, active ] });

        res.sendStatus(200);
    
    } catch (error) {
        res.send(error);
    }
});

//Actualizar un producto
server.put('/:id', async(req,res) => {
    try {
        const {description, price, picture, price_discount, active } = req.body;
        await sequelize.query(
            `UPDATE products SET
                description = ?, 
                price = ?, 
                picture = ?, 
                price_discount = ?,
                active = ?
            WHERE id = ${req.params.id}
            `,
        { replacements: [ description, price, picture, price_discount, active ] });

        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
})

//Borrar un producto



module.exports = server;