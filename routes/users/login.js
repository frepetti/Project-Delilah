const express = require('express');
const server = express();
const sequelize = require('./../../mysql');

server.post('/users/login', async (req,res) => {
    const { username, password } = req.body;
    try {
        const data = await sequelize.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            { replacements: [username, password ] }
        );

        res.send(data);
    } catch (err) {
        res.send(err);
    }
})