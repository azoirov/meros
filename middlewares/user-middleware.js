const { verifyToken } = require("../modules/jwt");

module.exports = async (req, res, next) => {
    const { users, sessions } = req.db;

    const token = req.cookies["token"] || req.headers["authorization"];

    if (token) {
        let { session_id } = verifyToken(token);
        let session;
        if (session_id) {
            session = await sessions.findOne({
                where: {
                    session_id,
                },
                raw: true,
            });
        }

        if (!session) {
            try {
                res.clearCookie("token").redirect("/");
            } catch (e) {
                res.redirect("/");
            } finally {
                return;
            }
        }

        const user = await users.findOne({
            where: {
                user_id: session.user_id,
            },
            raw: true,
        })

        req.user = {
            id: user.user_id,
            name: user.full_name,
            email: user.email,
            phone: user.phone_number,
            img: user.avatar,
            role: user.role,
            createdAt: user.createdAt
        }
    }

    next();
};
