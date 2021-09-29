const Jwt = require("jsonwebtoken");
const { SECRET_WORD } = require("../config");

const generateToken = (data) => Jwt.sign(data, SECRET_WORD),
    verifyToken = (data) => {
        try {
            let token = Jwt.verify(data, SECRET_WORD, { expiresIn: "7d" });
            return token;
        } catch (e) {
            return false;
        }
    };

module.exports = { generateToken, verifyToken };
