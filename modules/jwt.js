const Jwt = require("jsonwebtoken");
const { SECRET_WORD } = require("../config");

const generateToken = (data) => Jwt.sign(data, SECRET_WORD),
   verifyToken = (data) => {
      try {
         let token = Jwt.verify(data, SECRET_WORD);
         return token;
      } catch (e) {
         return false;
      }
   };

module.exports = { generateToken, verifyToken };