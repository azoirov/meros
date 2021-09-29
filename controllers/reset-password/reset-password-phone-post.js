const phoneValidation = require("../../validations/phone-validation");
const generateCode = require("../../modules/generate-code");
const sendSMS = require("../../modules/send-sms");

module.exports = async (req, res) => {
    try {
        const { sessions, users } = req.db;

        const { phone } = await phoneValidation.validateAsync(req.body);

        const candidate = await users.findOne({
            where: {
                phone,
            },
        });

        if (!candidate) {
            throw new Error("Phone does not exist");
        }

        const code = generateCode();

        await sessions.update(
            {
                code,
                user_agent: req.headers["user-agent"],
                ip_address:
                    req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            },
            {
                where: {
                    phone,
                },
            }
        );

        await sendSMS(phone, `Merosshop.uz uchun tasdiqlash kodi ${code}`);

        res.status(200).send({
            ok: true,
            message: "code sent",
            phone,
        });
    } catch (e) {
        res.status(400).send({
            ok: false,
            message: e + "",
        });
    }
};
