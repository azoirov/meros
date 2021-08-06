const Joi = require("joi");

module.exports = Joi.object({
    code_attempts: Joi.number().error(Error("Invalid code attempt")),
    phone_attempts: Joi.number().error(Error("Invalid phone attempt")),
    ban_time: Joi.number().error(Error("invalid phone")),
    verification_text: Joi.string().error(Error("invalid verification text")),
});
