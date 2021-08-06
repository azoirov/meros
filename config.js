require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRET_WORD: process.env.SECRET_WORD,
    TOKEN: process.env.TOKEN,
    BOT_USERNAME: process.env.BOT_USERNAME,
    PAYMENT_TOKEN: process.env.PAYMENT_TOKEN,
};
