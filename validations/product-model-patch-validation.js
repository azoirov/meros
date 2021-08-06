const Joi = require("joi");

module.exports = Joi.object({
    name: Joi.string().required(),
    difference: Joi.string()
        .valid("plus", "minus")
        .required()
        .error(Error("invalid difference")),
    difference_price: Joi.number()
        .required()
        .error(Error("Invalid difference price")),
    model_id: Joi.string().required().error(Error("Model id is required")),
});
