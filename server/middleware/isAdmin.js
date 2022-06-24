module.exports = (req, res, next) => {
    if (!req.user.admin)
        return res.status(401).send({ message: "Não autorizado. Necessário nível de acesso de administrador." });
    next();
}