const express = require('express');
const server = express();
const sequelize = require('./../../mysql');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const authMiddleware = require('./../../middlewares/auth');
const adminMiddleware = require('./../../middlewares/admin');

//Crear usuario

server.post('/', async (req,res) => {
    try{
        const { username, name, last_name, email, phone, address, password} = req.body;
        await sequelize.query(
            `INSERT into users
                (username, name, last_name, email, phone, address, password, role_id)
            VALUE
                (?, ?, ?, ?, ?, ?, ?, 2)
            
            `,
        { replacements: [ username, name, last_name, email, phone, address, password ] }
        );
        res.sendStatus(200);
    } catch(err) {
        res.send(err);
    }
});

//Crear Usuario Admin

server.post('/admin', authMiddleware, adminMiddleware, async (req,res) => {
    try{
        const { username, name, last_name, email, phone, address, password} = req.body;
        await sequelize.query(
            `INSERT into users
                (username, name, last_name, email, phone, address, password, role_id)
            VALUE
                (?, ?, ?, ?, ?, ?, ?, 1)
            
            `,
        { replacements: [ username, name, last_name, email, phone, address, password] }
        );
        res.sendStatus(200);
    } catch(err) {
        res.send(err);
    }
});

//Login Usuario
server.post('/login', async (req,res) => {
    const { username, password } = req.body;
    try {
        const data = await sequelize.query(
            `SELECT users.*, roles.role_type role FROM users 
            JOIN roles ON users.role_id = roles.id 
            WHERE username = ? AND password = ?
            `,
            { replacements: [ username, password ], type: sequelize.QueryTypes.SELECT }
        );
        
        if(data.length) {
            
            const token = jwt.sign({    //Genero una variable token y guardo los datos firmados
                username: data[0].username,
                role: data[0].role,
                user_id: data[0].id,
            }, config.firma)

            res.send({
                username: data[0].username,
                role: data[0].role,
                user_id: data[0].id,
                token
            });
        }  else {
            res.send('Usuario o contraseña incorrectos')
        }

    } catch (err) {
        res.send(err);
    }
})


module.exports = server;