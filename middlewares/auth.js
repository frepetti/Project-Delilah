const jwt = require("jsonwebtoken");
const config = require('./../config');

const notAuthorized = (res) => {
    res.status = 401;
    res.send({
        status: 401,
        message: 'No estas autorizado'
    });
}

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        notAuthorized(res);
    }

    const token = authHeader && authHeader.split(' ')[1]; //authHeader && authHeader.split => si authHeader existe, entonces hacer el split
    const authData = jwt.verify(token, config.firma)

    //Role & ID
    res.locals.role = authData.role;
    res.locals.user_id = authData.id;

    if (authData) {
        return next();
    }

    notAuthorized(res);
}