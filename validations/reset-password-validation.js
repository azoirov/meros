const Joi = require('joi');

module.exports = Joi.object({
   password: Joi.string()
      .required()
      .pattern(new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}'))
      .error(new Error('invalid password')),
   repeatedPassword: Joi.ref('password')
})