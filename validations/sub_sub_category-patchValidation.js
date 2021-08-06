const Joi = require("joi");

module.exports = Joi.object({
    sub_category_id: Joi.string()
        .required()
        .error(new Error("Secondary category is required")),
    sub_sub_category_name_uz: Joi.string()
        .required()
        .error(new Error("Sub category name uz is required")),
    sub_sub_category_name_ru: Joi.string()
        .required()
        .error(new Error("Sub category name ru is required")),
    sub_sub_category_name_en: Joi.string()
        .required()
        .error(new Error("Sub category name en is required")),
    sub_sub_category_id: Joi.string()
        .required()
        .error(new Error("Tertiary category is required")),
    category_id: Joi.string()
        .required()
        .error(new Error("Category is required"))
});
