const Joi = require("joi");

module.exports = Joi.object({
    uz_name: Joi.string().required().error(Error("invalid name")),
    en_name: Joi.string().required().error(Error("invalid name")),
    ru_name: Joi.string().required().error(Error("invalid name")),
    category_id: Joi.string().required().error(Error("Invalid category_id")),
});
