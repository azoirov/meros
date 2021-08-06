const Joi = require("joi");

module.exports = Joi.object({
    uz_name: Joi.string().required().error(Error("invalid uz name")),
    en_name: Joi.string().required().error(Error("invalid en name")),
    ru_name: Joi.string().required().error(Error("invalid ru name")),
    price: Joi.number().required().error(Error("invalid price")),
    sale: Joi.number().required().error(Error("invalid sale")),
    uz_description: Joi.string()
        .required()
        .error(Error("invalid description text")),
    ru_description: Joi.string()
        .required()
        .error(Error("invalid description text")),
    en_description: Joi.string()
        .required()
        .error(Error("invalid description text")),
    category_id: Joi.string().required().error(Error("invalid category")),
    product_brand_id: Joi.string().required().error(Error("invalid brand")),
    options: Joi.string()
        .required()
        .error(Error("Options mustbe type of JSON stringified object")),
    product_id: Joi.string().required().error(Error("product id is required")),
    thumbs: Joi.string(),
    sub_category_id: Joi.string().error(new Error("Secondary category is incorrect")),
    sub_sub_category_id: Joi.string().error(new Error("Tertiary category is incorrect")),
});
