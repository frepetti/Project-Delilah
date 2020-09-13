const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:/delilah_resto');

module.exports = sequelize;