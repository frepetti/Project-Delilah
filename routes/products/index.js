const express = require('express');
const server = express();
const sequelize = require('./../../mysql');
const authMiddleware = require('./../../middlewares/auth');
const adminMiddleware = require('./../../middlewares/admin');

//Consultar productos activos

server.get('/', authMiddleware, async(req,res) => {
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

server.post('/', authMiddleware, adminMiddleware, async(req,res) => {
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
server.put('/:id', authMiddleware, adminMiddleware, async(req,res) => {
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
server.delete('/:id', authMiddleware, adminMiddleware, async(req, res) => {

    try {
        await sequelize.query(
            `DELETE FROM products WHERE id = :id`,
        { replacements: { id: parseInt(req.params.id) } }
        );
    
        res.sendStatus(200);
    } catch (err) {
        res.send(err);
    }

});

//Ver un producto
server.get('/:id', authMiddleware, async(req,res) => {
    try {
        const data = await sequelize.query(
            'SELECT * from products WHERE id = :id',
            { replacements: { id: parseInt(req.params.id) }, type: sequelize.QueryTypes.SELECT },
        )
        res.send(data);
    } catch(err){
        res.send(err);
    }
});

module.exports = server;