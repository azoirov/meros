require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRET_WORD: process.env.SECRET_WORD,
    TOKEN: process.env.TOKEN,
    BOT_USERNAME: process.env.BOT_USERNAME,
    PAYMENT_TOKEN: process.env.PAYMENT_TOKEN,
    SMS_EMAIL: process.env.SMS_EMAIL,
    SMS_PASSWORD: process.env.SMS_PASSWORD,
};
