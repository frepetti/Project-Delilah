module.exports = (req, res, next) => {
    const role = res.locals.role;
    if (role === 'Admin') {
        return next();
    }

    res.status = 401;
    res.send({
        status: 401,
        message: 'No estas autorizado'
    })
}