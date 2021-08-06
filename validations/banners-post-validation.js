const Joi = require("joi");

module.exports = Joi.object({
    banner_name: Joi.string()
        .allow(
            "1010x350",
            "420x170_1",
            "1010x350_2",
            "1440x148_1",
            "290x780_1",
            "290x780_2",
            "1440x148_2"
        )
        .error(Error("Invalid banner")),
});
