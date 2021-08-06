const Joi = require("joi");

module.exports = Joi.object({
    phone: Joi.string()
        .pattern(new RegExp("^998[389][01345789][0-9]{7}$"))
        .error(Error("invalid phone")),
    email: Joi.string()
        .required()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "ru", "uz"] },
        })
        .error(Error("Invalid email"))
});
