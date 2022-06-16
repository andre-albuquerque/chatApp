module.exports = (req, res, next) => {
    if (!req.user.isAdmin)
        return res.status(401).send({ message: "Necessário acesso de administrador." });
    next();
}