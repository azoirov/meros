const { Op } = require("sequelize");
const { verifyToken } = require("../../modules/jwt");
const path = require("path");
const fs = require("fs/promises");

module.exports = class HomeController {
    static async HomeGet(req, res) {
        const {
            products,
            carts,
            wishlists,
            sessions,
            users,
            bestsellers,
            sponsors,
        } = req.db;

        let token = req.headers["authorization"];

        let wishlist = [];
        let cart = [];
        let user;

        if (token) {
            let { session_id } = verifyToken(token);
            let session = await sessions.findOne({
                where: {
                    session_id,
                },
                raw: true,
            });

            user = await users.findOne({
                user_id: session.user_id,
            });

            wishlist = await wishlists.findAll({
                where: {
                    user_id: req.user.user_id,
                },
                raw: true,
                include: {
                    model: products,
                },
            });

            cart = await carts.findAll({
                where: {
                    user_id: req.user.user_id,
                },
                raw: true,
                include: {
                    model: products,
                },
            });
        }

        let pros = await products.findAll({
            where: {
                sale: {
                    [Op.gt]: 50,
                },
            },
            raw: true,
            limit: 8,
        });

        let bests = await bestsellers.findAll({
            limit: 8,
            raw: true,
            include: {
                model: products,
            },
        });

        let banners = await fs.readFile(
            path.join(__dirname, "..", "..", "banners.json"),
            { encoding: "utf-8" }
        );
        let partners = await sponsors.findAll({
            raw: true,
        });

        banners = await JSON.parse(banners)
        let brands = await req.db.brands.findAll({raw: true})

        res.render("index", {
            path: "/",
            title: "Meros | Home",
            products: pros,
            categories: req.categories,
            bestsellers: bests,
            cart: cart,
            wishlist: wishlist,
            banners: banners,
            brands: brands,
            user: req.user,
        });
    }
};
