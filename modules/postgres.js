const { Sequelize } = require("sequelize")

const Models = require("../models/models")

const config = require("../config")

const sequelize = new Sequelize(config.DB_URL, {
    logging: false,
})

module.exports = async function () {
    try {
        const db = {};

        db.users = await Models.Users(Sequelize, sequelize);
        db.attempts = await Models.Attempts(Sequelize, sequelize);
        db.sessions = await Models.Sessions(Sequelize, sequelize);
        db.bans = await Models.Bans(Sequelize, sequelize);
        db.categories = await Models.Categories(Sequelize, sequelize);
        db.models = await Models.Models(Sequelize, sequelize);
        db.product_colors = await Models.ProductColors(Sequelize, sequelize);
        db.products = await Models.Products(Sequelize, sequelize);
        db.carts = await Models.Carts(Sequelize, sequelize);
        db.orders = await Models.Orders(Sequelize, sequelize);
        db.sponsors = await Models.Sponsors(Sequelize, sequelize);
        db.brands = await Models.Brands(Sequelize, sequelize);
        db.bestsellers = await Models.Bestsellers(Sequelize, sequelize);
        db.wishlists = await Models.WishLists(Sequelize, sequelize);
        db.order_details = await Models.OrderDetails(Sequelize, sequelize);
        db.product_brands = await Models.ProductBrands(Sequelize, sequelize);
        db.comments = await Models.Comments(Sequelize, sequelize);
        db.comment_thumbs = await Models.CommentThumbs(Sequelize, sequelize);
        db.recomendations = await Models.Recomendations(Sequelize, sequelize);
        db.sub_category = await Models.SubCategory(Sequelize, sequelize);
        db.sub_sub_category = await Models.SubSubCategory(Sequelize, sequelize);
        db.banners = await Models.Banners(Sequelize, sequelize);

        await db.categories.hasMany(db.banners, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.banners.belongsTo(db.categories, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.products.hasMany(db.order_details, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.products.hasOne(db.recomendations, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.recomendations.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.order_details.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.products.hasMany(db.carts, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.carts.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.products.hasMany(db.wishlists, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.wishlists.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.products.hasOne(db.bestsellers, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.bestsellers.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.comments.hasMany(db.comment_thumbs, {
            foreignKey: {
                name: "comment_id",
                allowNull: false,
            },
        });

        await db.comment_thumbs.belongsTo(db.comments, {
            foreignKey: {
                name: "comment_id",
                allowNull: false,
            },
        });

        await db.users.hasMany(db.comments, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.comments.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.products.hasMany(db.comments, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.comments.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.users.hasOne(db.attempts, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.attempts.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.users.hasOne(db.bans, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.bans.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.users.hasMany(db.sessions, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.sessions.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.users.hasMany(db.carts, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.carts.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.users.hasMany(db.orders, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.orders.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.users.hasMany(db.wishlists, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.wishlists.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.categories.hasMany(db.sub_category, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.sub_category.belongsTo(db.categories, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.sub_category.hasMany(db.sub_sub_category, {
            foreignKey: {
                name: "sub_category_id",
                allowNull: false,
            },
        });

        await db.sub_sub_category.belongsTo(db.sub_category, {
            foreignKey: {
                name: "sub_category_id",
                allowNull: false,
            },
        });

        await db.sub_sub_category.hasMany(db.products, {
            foreignKey: {
                name: "sub_sub_category_id",
                allowNull: true,
            },
        });
        await db.products.belongsTo(db.sub_sub_category, {
            foreignKey: {
                name: "sub_sub_category_id",
                allowNull: true,
            },
        });

        await db.products.hasMany(db.models, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.models.belongsTo(db.products, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.products.hasMany(db.product_colors, {
            foreignKey: {
                name: "product_id",
                allowNull: false,
            },
        });

        await db.orders.hasMany(db.order_details, {
            foreignKey: {
                name: "order_id",
                allowNull: false,
            },
        });

        await db.order_details.belongsTo(db.orders, {
            foreignKey: {
                name: "order_id",
                allowNull: false,
            },
        });

        await db.categories.hasMany(db.brands, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.brands.belongsTo(db.categories, {
            foreignKey: {
                name: "category_id",
                allowNull: false,
            },
        });

        await db.product_brands.hasMany(db.products, {
            foreignKey: {
                name: "product_brand_id",
                allowNull: false,
            },
        });

        await db.products.belongsTo(db.product_brands, {
            foreignKey: {
                name: "product_brand_id",
                allowNull: false,
            },
        });

        await db.product_colors.hasMany(db.order_details, {
            foreignKey: {
                name: "product_color_id",
                allowNull: true,
            },
        });

        await db.order_details.belongsTo(db.product_colors, {
            foreignKey: {
                name: "product_color_id",
                allowNull: true,
            },
        });

        await db.models.hasMany(db.order_details, {
            foreignKey: {
                name: "model_id",
                allowNull: true,
            },
        });

        await db.order_details.belongsTo(db.models, {
            foreignKey: {
                name: "model_id",
                allowNull: true,
            },
        });

        await db.product_colors.hasMany(db.carts, {
            foreignKey: {
                name: "product_color_id",
                allowNull: true,
            },
        });

        await db.carts.belongsTo(db.product_colors, {
            foreignKey: {
                name: "product_color_id",
                allowNull: true,
            },
        });

        await db.models.hasMany(db.carts, {
            foreignKey: {
                name: "model_id",
                allowNull: true,
            },
        });

        await db.carts.belongsTo(db.models, {
            foreignKey: {
                name: "model_id",
                allowNull: true,
            },
        });

        await db.categories.hasMany(db.products, {
            foreignKey: {
                name: "category_id",
                allowNull: false
            }
        });

        await db.products.belongsTo(db.categories, {
            foreignKey: {
                name: "category_id",
                allowNull: false
            }
        });

        await db.sub_category.hasMany(db.products, {
            foreignKey: {
                name: "sub_category_id",
                allowNull: true
            }
        })

        await db.products.belongsTo(db.sub_category, {
            foreignKey: {
                name: "sub_category_id",
                allowNull: true
            }
        });

        await db.categories.hasMany(db.sub_sub_category, {
            foreignKey: {
                name: "category_id",
                allowNull: false
            }
        });

        await db.sub_sub_category.belongsTo(db.categories, {
            foreignKey: {
                name: "category_id",
                allowNull: false
            }
        })

        // await db.users.update(
        //     { role: "superadmin" },
        //     {
        //         where: {
        //             phone_number: "998998211744",
        //         },
        //     }
        // )

        await sequelize.sync({ force: false })
        // await sequelize.sync({ alter: true })
        return db;
    } catch (e) {
        console.log(e);
    }
};
