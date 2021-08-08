const { verifyToken } = require("../../modules/jwt");
const { Op } = require("sequelize");
const fs = require("fs/promises");
const path = require("path");
const { inCart, howManyStar } = require("../../modules/product");
module.exports = class ProductsController {
    // static async ProductsGetController(req, res) {
    //     try {
    //         const {
    //             categories,
    //             products,
    //             carts,
    //             wishlists,
    //             sessions,
    //             users,
    //             bestsellers,
    //             sponsors,
    //         } = req.db;

    //         const { sub_category_slug } = req.params;
    //         let { c_page, p_page } = req.query;

    //         c_page = Number(c_page);
    //         p_page = Number(p_page);

    //         let token = req.headers["authorization"];

    //         let cats = await categories.findAll({
    //             raw: true,
    //         });

    //         let wishlist = [];
    //         let cart = [];
    //         let user;

    //         if (token) {
    //             let { session_id } = verifyToken(token);
    //             let session = await sessions.findOne({
    //                 where: {
    //                     session_id,
    //                 },
    //                 raw: true,
    //             });

    //             user = await users.findOne({
    //                 user_id: session.user_id,
    //             });

    //             wishlist = await wishlists.findAll({
    //                 where: {
    //                     user_id: req.user.user_id,
    //                 },
    //                 raw: true,
    //                 include: {
    //                     model: products,
    //                 },
    //             });

    //             cart = await carts.findAll({
    //                 where: {
    //                     user_id: req.user.user_id,
    //                 },
    //                 raw: true,
    //                 include: {
    //                     model: products,
    //                 },
    //             });
    //         }

    //         let category = await categories.findOne({
    //             where: {
    //                 slug: category_slug,
    //             },
    //             raw: true,
    //         });

    //         if (!category) throw new Error("Catetgory not found");

    //         let all = await products.findAll({
    //             where: {
    //                 category_id: category.category_id,
    //             },
    //             include: {
    //                 model: categories,
    //             },
    //             raw: true,
    //             limit: p_page ? p_page : 20,
    //             offset: c_page && p_page ? p_page * (c_page - 1) : 0,
    //         });

    //         let pros = await products.findAll({
    //             where: {
    //                 sale: {
    //                     [Op.gt]: 50,
    //                 },
    //             },
    //             include: {
    //                 model: req.db.categories,
    //             },
    //             raw: true,
    //             limit: 8,
    //         });

    //         let bests = await bestsellers.findAll({
    //             limit: 8,
    //             raw: true,
    //             include: {
    //                 model: products,
    //             },
    //         });

    //         let banners = await fs.readFile(
    //             path.join(__dirname, "..", "..", "banners.json"),
    //             (err, files) => {}
    //         );

    //         let partners = await sponsors.findAll({
    //             raw: true,
    //         });

    //         banners = await JSON.parse(banners);


    //         res.render("category", {
    //             path: "/",
    //             title: "Meros | Home",
    //             products_with_sale: pros,
    //             bestsellers: bests,
    //             cart: cart,
    //             wishlist: wishlist,
    //             banners: banners,
    //             sponsors: partners,
    //             products: all,
    //             categories: req.categories,
    //             user: req.user,
    //         });
    //     } catch (e) {
    //         res.render("category", {
    //             error: e + "",
    //             path: "/",
    //             title: "Meros | Home",
    //         });
    //     }
    // }

    static async ProductsFilterGetController(req, res) {
        try {
            let { p_page, c_page, min, max, brand } = req.query;

            c_page = Number(c_page);
            p_page = Number(p_page);
            let products;
            if (brand) {
                let b = await req.db.product_brands.findOne({
                    where: {
                        brand_name: {
                            [Op.iLike]: brand,
                        },
                    },
                    raw: true,
                });
                if (!brand) {
                    throw new Error("Brand not found");
                }
                products = await req.db.products.findAll({
                    where: {
                        product_brand_id: b.product_brand_id,
                        price: {
                            [Op.and]: {
                                [Op.lte]: max,
                                [Op.gte]: min,
                            },
                        },
                    },
                    raw: true,
                });
            } else {
                products = await req.db.products.findAll({
                    raw: true,
                    where: {
                        price: {
                            [Op.and]: {
                                [Op.lte]: max,
                                [Op.gte]: min,
                            },
                        },
                    },
                    limit: p_page,
                    offset: p_page * (c_page - 1),
                });
            }

            res.status(200).json({
                ok: true,
                result: {
                    products,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SingleProductGetController(req, res) {
        try {
            const { product_slug } = req.params;
            let product = await req.db.products.findOne({
                where: {
                    slug: product_slug,
                },
                raw: true,
            });

            let cart = await req.db.carts.findOne({
                where: {
                    product_id: product.product_id,
                    user_id: req.user.id
                },
                raw: true
            })

            product.cart = cart ? cart.count : 0

            let comments = await req.db.comments.findAll({
                where: {
                    product_id: product.product_id,
                },
                include: {
                    model: req.db.users
                },
                raw: true,
            });

            let comment_thumbs = await req.db.comment_thumbs.findAll({
                raw: true,
            });

            for (let comment of comments) {
                let thumbs = comment_thumbs.filter(
                    (e) => e.comment_id === comment.comment_id
                );
                comment.thumb = [...thumbs];
            }

            let stars = 0;
            comments.forEach(comment => {
                stars += comment.star
            })
            stars = Math.round(stars/comments.length)
            product.star = stars

            res.render("single-product", {
                title: `Meros | ${product.ru_name}`,
                product,
                comments,
                categories: req.categories,
                user: req.user,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartAddController(req, res) {
        try {
            let { product_id } = req.body;

            if (!req.user) {
                throw new Error("User is not logged in")
            }

            let cart = await req.db.carts.findOne({
                where: { user_id: req.user.id, product_id },
                raw: true,
            });

            if (cart) {
                throw new Error("Already added");
            }

            cart = await req.db.carts.create({
                user_id: req.user.id,
                product_id: product_id
            });

            cart = await cart.dataValues;

            res.status(200).json({
                ok: true,
                result: {
                    user: req.user,
                    cart_added: cart,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartPlusPatchController(req, res) {
        try {
            let { product_id } = req.body

            if (!req.user) {
                throw new Error("User is not logged in")
            }

            let cart
            if (req.user) {
                cart = await req.db.carts.increment("count", {
                    by: 1,
                    where: {
                        user_id: req.user.id,
                        product_id,
                    },
                    include: {
                        model: req.db.products,
                    },
                    raw: true,
                    returning: true,
                });
            }

            res.status(200).json({
                ok: true,
                message: "added",
                cart_incremented: cart[0][0][0],
                user: req.user,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartMinusPatchController(req, res) {
        try {
            let { product_id } = req.body;
            if (!req.user) {
                throw new Error("User is not logged in")
            }
            let cart = await req.db.carts.findOne({
                where: {
                    user_id: req.user.id,
                    product_id,
                },
                raw: true,
            });
            if (!cart) {
                throw new Error("Cart is not found");
            }
            let isDestroyed = false
            if (cart.count === 1) {

                cart = await req.db.carts.destroy({
                    where: {
                        user_id: req.user.id,
                        product_id,
                    },
                    raw: true,
                    returning: true,
                });

                cart = 0;
            } else {
                cart = await req.db.carts.decrement("count", {
                    by: 1,
                    where: {
                        user_id: req.user.id,
                        product_id,
                    },
                    raw: true,
                    returning: true,
                });
            }
            res.status(200).json({
                ok: true,
                message: "decremented",
                cart_decremented: cart[0][0][0],
                user: req.user
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
                user: req.user
            });
        }
    }

    static async CartGetController(req, res) {
        try {
            let user = await req.db.users.findOne({
                where: {
                    user_id: req.user.id,
                },
                raw: true,
            });

            let cart = await req.db.carts.findAll({
                where: {
                    user_id: user.user_id,
                },
                raw: true,
                include: {
                    model: req.db.products,
                },
            });

            let totalPrice = 0;

            for (let c of cart) {
                totalPrice +=
                    (c["product.price"] * (100 - c["product.sale"])) / 100;
            }
            res.render("cart", {
                title: "Meros | Cart",
                cart: cart,
                user: req.user,
                categories: req.categories,
                totalPrice,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CheckoutGetController(req, res) {
        try {
            let user = await req.db.users.findOne({
                where: {
                    user_id: req.user.id,
                },
                raw: true,
            });

            let cart = await req.db.carts.findAll({
                where: {
                    user_id: user.user_id,
                },
                raw: true,
                include: {
                    model: req.db.products,
                },
            });

            let totalPrice = 0;

            for (let c of cart) {
                totalPrice +=
                    (c["product.price"] * (100 - c["product.sale"])) / 100;
            }
            res.render("checkout", {
                title: "Meros | Checkout",
                user: req.user,
                categories: req.categories,
                cart,
                totalPrice,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async WishListAddController(req, res) {
        try {
            let { product_id } = req.body;
            if (!req.user) {
                throw new Error("User is not logged in")
            }
            let wishlist;

            wishlist = await req.db.wishlists.findOne({
                where: {
                    user_id: req.user.id,
                    product_id,
                },
                raw: true,
            });

            if (wishlist) {
                throw new Error("Already added");
            }

            wishlist = await req.db.wishlists.create({
                user_id: req.user.id,
                product_id: product_id,
            });
            wishlist = await wishlist.dataValues;


            res.status(200).json({
                ok: true,
                result: {
                    user: req.user,
                    wishlist: wishlist,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async WishlistDeleteController(req, res) {
        try {
            let { product_id } = req.body;
            if (!req.user) {
                throw new Error("User is not logged in")
            }

            await req.db.wishlists.destroy({
                where: {
                    user_id: req.user.id,
                    product_id,
                },
            });

            res.status(200).json({
                ok: true,
                user: req.user,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: true,
                message: e + "",
            });
        }
    }

    static async WishListGetController(req, res) {
        try {
            let wishlist;

            if (!req.user) throw new Error("User is not loggeed in")

            wishlist = await req.db.wishlists.findAll({
                where: {
                    user_id: req.user.id,
                },
                raw: true,
            });


            res.status(200).json({
                ok: true,
                result: {
                    user,
                    wishlist,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsSearchGetController(req, res) {
        try {
            let { q, category_id } = req.query

            let products;

            if (category_id === "all" || !category_id) {
                products = await req.db.products.findAll({
                    where: {
                        [Op.or]: {
                            uz_name: {
                                [Op.iLike]: `%${q}%`
                            },
                            ru_name: {
                                [Op.iLike]: `%${q}%`
                            },
                            en_name: {
                                [Op.iLike]: `%${q}%`
                            }
                        }
                    }
                })
            } else {
                products = await req.db.products.findAll({
                    where: {
                        category_id: category_id,
                        [Op.or]: {
                            uz_name: {
                                [Op.iLike]: `%${q}%`
                            },
                            ru_name: {
                                [Op.iLike]: `%${q}%`
                            },
                            en_name: {
                                [Op.iLike]: `%${q}%`
                            }
                        }
                    }
                })
            }

            res.status(200).json({
                ok: true,
                result: {
                    products
                }
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentsPostController(req, res) {
        try {
            let { comment_text, product_id, star } = req.body;
            const files = req.files;
            let comment;
            let comment_thumbs;
            if (!files) {
                comment = await req.db.comments.create({
                    user_id: req.user.id,
                    product_id,
                    comment_text,
                    star: Number(star),
                });
            } else {
                comment = await req.db.comments.create({
                    user_id: req.user.id,
                    product_id,
                    comment_text,
                    star: Number(star),
                });

                for (let i in files) {
                    if (
                        files[i].mimetype.split("/")[0] !== "image" &&
                        files[i].mimetype.split("/")[0] !== "vector"
                    ) {
                        throw new Error(
                            "Invalid file, file must be type of image"
                        );
                    }

                    let file_type = files[i].mimetype.split("/")[1];

                    let thumb_name = files[i].md5;

                    let thumb_path = path.join(
                        __dirname,
                        "..",
                        "public",
                        "images",
                        "comment_thumbs",
                        `${thumb_name}.${file_type}`
                    );

                    await files[i].mv(thumb_path, (err) => {
                        if (err) throw new Error(err);
                    });

                    await req.db.comment_thumbs.create({
                        thumb: `${thumb_name}.${file_type}`,
                        comment_id: comment.dataValues.comment_id,
                    });
                }
                comment_thumbs = await req.db.comment_thumbs.findAll({
                    where: {
                        comment_id: comment.dataValues.comment_id,
                    },
                    raw: true,
                });
            }
            res.status(201).json({
                ok: true,
                result: {
                    comment: comment.dataValues,
                    comment_thumbs: comment_thumbs,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async cartGetController(req, res) {
        res.render("cart", {
            title: "Meros | Cart",
            path: "/cart",
            user: req.user,
            categories: req.categories,
        });
    }

    static async CategoryGetController(req, res) {
        try {
            const { category_slug } = req.params;

            let { c_page } = req.query;

            c_page = c_page || 1;

            let category = await req.db.categories.findOne({
                where: {
                    slug: category_slug
                },
            });

            if (!category) {
                throw new Error("Category not found");
            }

            let products = await req.db.products.findAll({
                    where: {
                        category_id: category.dataValues.category_id
                    },
                    limit: 20,
                    offset: 20 * (c_page - 1),
                    raw: true,
                    include: [
                        {
                            model: req.db.categories,
                        },
                        {
                            model: req.db.sub_category
                        }
                    ]
                }
            );

            let sub_category = await req.db.sub_category.findAll({
                where: {
                    category_id: category.dataValues.category_id,
                },
                raw: true,
            });

            let recomendations = await req.db.recomendations.findAll({
                raw: true,
                category_id: category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let bestsellers = await req.db.bestsellers.findAll({
                raw: true,
                category_id: category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let rec = [...recomendations, ...bestsellers];
            let arr = [];
            rec.forEach(el => {
                if(!arr.includes(el)) {
                    arr.push(el)
                }
            });
            rec = arr
            rec = await howManyStar(req.db, rec)
            rec = await inCart(req.db, rec, req.user.id);

            let banners = await req.db.banners.findOne({
                where: {
                    category_id: category.dataValues.category_id,
                },
                raw: true,
            });

            let brands = await req.db.brands.findAll({
                where: {
                    category_id: category.dataValues.category_id,
                },
                raw: true,
            });

            let sponsors = await req.db.sponsors.findAll({
                raw: true,
            })

            let sub_categories = await req.db.sub_category.findAll({ raw: true });
            let sub_sub_categories = await req.db.sub_sub_category.findAll({ raw: true });

            sub_categories = sub_categories.map(el => {
                el.sub_sub_categories = sub_sub_categories.filter(c => c.sub_category_id === el.sub_category_id)
                return el
            })

            let goodOffers = await req.db.products.findAll({
                where: {
                    category_id: sub_sub_category.category_id,
                    sale: {
                        [Op.gte]: 0
                    },
                },
                include: [
                    {
                        model: req.db.categories
                    },
                    {
                        model: req.db.sub_category
                    }
                ],
                raw: true
            });




            if (req.user) {
                products = await inCart(req.db, products, req.user.id);
                goodOffers = await inCart(req.db, goodOffers, req.user.id)
            }


            products = await howManyStar(req.db, products)
            goodOffers = await howManyStar(req.db, goodOffers)
            res.render("sub-category", {
                title: "Meros | " + category.ru_name.toUpperCase(),
                path: "/category/" + category.dataValues.category_slug,
                user: req.user,
                category: category.dataValues,
                sub_category,
                banners,
                brands,
                sponsors,
                categories: req.categories,
                products,
                goodOffers: sale,
                recommendation: rec,
            });
        } catch (e) {
            console.log(e)
            res.send(e);
        }
    }

    static async SubCategoryGetController(req, res) {
        try {
            const { sub_category_slug } = req.params;

            let { c_page } = req.query;

            c_page = c_page || 1;

            let sub_category = await req.db.sub_category.findOne({
                where: {
                    sub_category_slug: sub_category_slug
                },
            });

            if (!sub_category) {
                throw new Error("Category not found");
            }

            let products = await req.db.products.findAll({
                    where: {
                        sub_category_id: sub_category.dataValues.sub_category_id
                    },
                    limit: 20,
                    offset: 20 * (c_page - 1),
                    raw: true,
                    include: [
                        {
                            model: req.db.categories,
                        },
                        {
                            model: req.db.sub_category
                        }
                    ]
                }
            );

            let sub_sub_category = await req.db.sub_sub_category.findAll({
                where: {
                    category_id: sub_category.dataValues.category_id,
                },
                raw: true,
            });

            let recomendations = await req.db.recomendations.findAll({
                raw: true,
                category_id: sub_category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let bestsellers = await req.db.bestsellers.findAll({
                raw: true,
                category_id: sub_category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let rec = [...recomendations, ...bestsellers];
            let arr = [];
            rec.forEach(el => {
                if(!arr.includes(el)) {
                    arr.push(el)
                }
            });
            rec = arr
            rec = await howManyStar(req.db, rec)
            if(req.user) {
                rec = await inCart(req.db, rec, req.user.id);
            }

            let banners = await req.db.banners.findOne({
                where: {
                    category_id: sub_category.dataValues.category_id,
                },
                raw: true,
            });

            let brands = await req.db.brands.findAll({
                where: {
                    category_id: sub_category.dataValues.category_id,
                },
                raw: true,
            });

            let sponsors = await req.db.sponsors.findAll({
                raw: true,
            })

            let sub_sub_categories = await req.db.sub_sub_category.findAll({
                where: {
                    sub_category_id: sub_category.sub_category_id
                },
                raw: true
            });

            // sub_categories = sub_categories.map(el => {
            //     el.sub_sub_categories = sub_sub_categories.filter(c => c.sub_category_id === el.sub_category_id)
            //     return el
            // })


            let goodOffers = await req.db.products.findAll({
                where: {
                    category_id: sub_category.category_id,
                    sale: {
                        [Op.gte]: 50
                    },
                },
                include: [
                    {
                        model: req.db.categories
                    },
                    {
                        model: req.db.sub_category
                    }
                ],
                raw: true
            })

            let category = await req.db.categories.findOne({
                where: {
                    category_id: sub_category.category_id
                },
                raw: true
            })


            if (req.user) {
                products = await inCart(req.db, products, req.user.id);
                goodOffers = await inCart(req.db, goodOffers, req.user.id)
            }

            products = await howManyStar(req.db, products)
            goodOffers = await howManyStar(req.db, goodOffers)
            res.render("sub-sub-category", {
                title: "Meros | " + sub_category.sub_category_name_ru.toUpperCase(),
                user: req.user,
                    sub_category,
                banners,
                brands,
                sponsors,
                categories: req.categories,
                products,
                goodOffers,
                sub_sub_categories,
                category,
                recommendation: rec
            });
        } catch (e) {
            console.log(e)
            res.send(e);
        }
    }

    static async ProductsGetController(req, res) {
        try {
            const { sub_sub_category_slug } = req.params;
            let { c_page } = req.query;

            c_page = c_page || 1;

            let sub_sub_category = await req.db.sub_sub_category.findOne({
                where: {
                    sub_sub_category_slug,
                },
            });

            if (!sub_sub_category) {
                throw new Error("SubSubCategory not found");
            }
            let products = await req.db.products.findAll({
                where: {
                    sub_sub_category_id:
                    sub_sub_category.dataValues.sub_sub_category_id,
                },
                raw: true,

                include: [
                    {
                        model: req.db.categories
                    },
                    {
                        model: req.db.sub_sub_category
                    }
                ],

                offset: 8 * (c_page - 1),
                limit: 8

            });

            let recomendations = await req.db.recomendations.findAll({
                raw: true,
                category_id: sub_sub_category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let bestsellers = await req.db.bestsellers.findAll({
                raw: true,
                category_id: sub_sub_category.category_id,
                include: {
                    model: req.db.products,
                    include: req.db.categories
                }
            });

            let rec = [...recomendations, ...bestsellers];
            let arr = [];
            rec.forEach(el => {
                if(!arr.includes(el)) {
                    arr.push(el)
                }
            });
            rec = arr
            rec = await howManyStar(req.db, rec)
            rec = await inCart(req.db, rec, req.user.id);

            let brands = await req.db.brands.findAll({
                where: {
                    category_id: sub_sub_category.dataValues.category_id,
                },
                raw: true,
            });

            let sponsors = await req.db.sponsors.findAll({
                raw: true,
            });
            let banners = await req.db.banners.findOne({
                where: {
                    category_id: sub_sub_category.dataValues.category_id,
                },
                raw: true,
            });


            let goodOffers = await req.db.products.findAll({
                where: {
                    category_id: sub_sub_category.category_id,
                    sale: {
                        [Op.gte]: 0
                    },
                },
                include: [
                    {
                        model: req.db.categories
                    },
                    {
                        model: req.db.sub_category
                    }
                ],
                raw: true
            });

            let sale = [];
            while (sale.length<=8 && goodOffers.length > 0) {
                let i = Math.random() * goodOffers.length - 1;
                let item = goodOffers.pop(goodOffers[i]);
                sale.push(item)
            }

            if(req.user) {
                products = await inCart(req.db, products, req.user.id);
                sale = await inCart(req.db, sale, req.user.id);
            }

            let home_banners = await fs.readFile(path.join(__dirname, "..", "..", "banners.json"), {encoding: "utf-8"});

            home_banners = await JSON.parse(home_banners);

            console.log(home_banners)

            console.log(sale)
            res.render("category", {
                title:
                    "Meros | " +
                    sub_sub_category.dataValues.sub_sub_category_name_ru,
                user: req.user,
                sub_sub_category: sub_sub_category.dataValues,
                products,
                recommendation: rec,
                categories: req.categories,
                bestsellers,
                banners,
                brands,
                sponsors,
            });
        } catch (e) {
            console.log(e)
            res.send(e);
        }
    }
};
