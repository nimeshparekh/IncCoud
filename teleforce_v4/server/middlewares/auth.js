const jwt = require("jsonwebtoken");
const SECRET_KEY = "Garuda@dv-iagents-secret";

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY,function(err, decoded) {
            req.query.tknuserid = decoded.id
            req.query.tknuserrole = decoded.role
            req.query.tknuid = decoded.uid
            req.query.tknagentrole = decoded.agentrole
            req.query.tknusecret = decoded.secret
        });
        next();
    } catch (error) {
        res.status(200).json({ token:'invalid',message: "access token invalid." });
    }
};
