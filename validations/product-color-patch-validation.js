const Joi = require("joi");

module.exports = Joi.object({
    product_color_name: Joi.string().required(),
    product_color_id: Joi.string().required().error(Error("invalid model id")),
});
