const categoryPostValidation = require("../../validations/category-post-validation");
const productPostValidation = require("../../validations/product-post-validation");
const path = require("path");
const slugify = require("slugify");
const productColorsPostValidation = require("../../validations/product-colors-post-validation");
const productModelPostValidation = require("../../validations/product-model-post-validation");
const productPatchValidation = require("../../validations/product-patch-validation");
const productModelPatchValidation = require("../../validations/product-model-patch-validation");
const productColorPatchValidation = require("../../validations/product-color-patch-validation");
const categoryPatchValidation = require("../../validations/category-patch-validation");
const settingsPatchValidation = require("../../validations/settings-patch-validation");
const fs = require("fs").promises;
const bannersPostValidation = require("../../validations/banners-post-validation");
const { Op } = require("sequelize");
const sub_categoryPostValidation = require("../../validations/sub_category-post-validation");
const sub_categoryPatchValidation = require("../../validations/sub_category-patch-validation");
const sub_sub_categoryPatchValidation = require("../../validations/sub_sub_category-patchValidation");
const sub_sub_categoryPostValidation = require("../../validations/sub_sub_category-post-validation");

module.exports = class AdminController {
    static async adminGetController(req, res) {
        res.render("admin/dashboard", {
            title: "Admin Panel",
            admin: req.admin,
            path: "/",
        });
    }

    static async CategoriesPostController(req, res) {
        try {
            const { uz_name, ru_name, en_name } =
                await categoryPostValidation.validateAsync(req.body);

            let category = await req.db.categories.findOne({
                where: {
                    [Op.or]: [
                        { uz_name: uz_name.toLowerCase() },
                        { ru_name: ru_name.toLowerCase() },
                        { en_name: en_name.toLowerCase() },
                    ],
                },
                raw: true,
            });

            if (category) {
                throw new Error("Category name must be unique");
            }

            if (!(req?.files?.thumb || req?.files?.icon_thumb)) {
                throw new Error("Category thumb and icon thumb is required");
            }

            let thumb = req.files.thumb;
            let icon_thumb = req.files.icon_thumb;

            if (
                thumb.mimetype.split("/")[0] !== "image" &&
                thumb.mimetype.split("/")[0] !== "vector" &&
                icon_thumb.mimetype.split("/")[0] !== "image" &&
                icon_thumb.mimetype.split("/")[0] !== "vector"
            ) {
                throw new Error("Please upload image");
            }

            await thumb.mv(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "categories",
                    `${thumb.md5}.${thumb.mimetype.split("/")[1]}`
                ),
                (err) => {
                }
            );

            await icon_thumb.mv(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "categories-icons",
                    `${icon_thumb.md5}.${icon_thumb.mimetype.split("/")[1].substr(0, 3)}`
                ),
                (err) => {
                }
            );

            category = await req.db.categories.create({
                uz_name,
                ru_name,
                en_name,
                thumb: `${thumb.md5}.${thumb.mimetype.split("/")[1]}`,
                icon_thumb: `${icon_thumb.md5}.${icon_thumb.mimetype
                    .split("/")[1]
                    .substr(0, 3)}`,
                slug: slugify(uz_name.toLowerCase()),
            });

            category = await category.dataValues;

            res.status(200).json({
                ok: true,
                message: "published",
                result: {
                    category,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryGetById(req, res) {
        try {
            const id = req.params.id;

            const category = await req.db.categories.findOne({
                where: {
                    category_id: id,
                },
            });

            res.status(200).json({
                ok: true,
                category,
            });
        } catch (e) {
            res.status(404).json({
                ok: false,
                message: "not found",
            });
        }
    }

    static async CategoriesDeleteController(req, res) {
        try {
            const { id } = req.body;

            await req.db.categories.destroy({
                where: {
                    category_id: id,
                },
            });

            await req.db.products.destroy({
                where: {
                    category_id: id,
                },
            });

            await req.db.sub_category.destroy({
                where: {
                    category_id: id,
                },
            });

            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoriesGetController(req, res) {
        try {
            let { p_page, c_page } = req.query;
            if (!(p_page || c_page)) {
                p_page = 10;
                c_page = 1;
            }
            if (Number(p_page) === NaN || Number(c_page) === NaN) {
                throw new Error("invalid c_page and p_page options");
            }

            const totalCount = await req.db.categories.count();

            const categories = await req.db.categories.findAll({
                raw: true,
                limit: p_page,
                offset: p_page * (c_page - 1),
            });

            for (let category of categories) {
                let brands = await req.db.brands.findAll({
                    where: {
                        category_id: category.category_id,
                    },
                    raw: true,
                });
                category.brands = brands;
            }

            res.render("admin/categories", {
                title: "Admin | Categories",
                categories,
                totalCount,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryPatchController(req, res) {
        try {
            const { uz_name, ru_name, en_name, category_id } =
                await categoryPatchValidation.validateAsync(req.body);

            let category = await req.db.categories.findOne({
                where: {
                    slug: slugify(uz_name.toLowerCase()),
                },
                raw: true,
            });

            const c = await req.db.categories.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });

            if (c.slug !== category?.slug) {
                if (category) {
                    throw new Error("Category name must be unique");
                }
            }

            let thumb;
            let icon_thumb;

            if (req.files) {
                if (req.files.thumb) {
                    thumb = req.files.thumb;

                    if (
                        thumb.mimetype.split("/")[0] !== "image" &&
                        thumb.mimetype.split("/")[0] !== "vector"
                    ) {
                        throw new Error("Please upload image");
                    }

                    await thumb.mv(
                        path.join(
                            __dirname,
                            "..",
                            "..",
                            "public",
                            "images",
                            "categories",
                            `${thumb.md5}.${thumb.mimetype.split("/")[1]}`
                        ),
                        (err) => {
                        }
                    );
                }

                if (req.files.icon_thumb) {
                    icon_thumb = req.files.icon_thumb;

                    if (
                        icon_thumb.mimetype.split("/")[0] !== "image" &&
                        icon_thumb.mimetype.split("/")[0] !== "vector"
                    ) {
                        throw new Error("Please upload image");
                    }

                    await icon_thumb.mv(
                        path.join(
                            __dirname,
                            "..",
                            "..",
                            "public",
                            "images",
                            "categories-icons",
                            `${icon_thumb.md5}.${icon_thumb.mimetype.split("/")[1]}`
                        ),
                        (err) => {
                        }
                    );
                }
            }

            category = await req.db.categories.update(
                {
                    uz_name,
                    ru_name,
                    en_name,
                    thumb: thumb
                        ? `${thumb.md5}.${thumb.mimetype.split("/")[1]}`
                        : c.thumb,
                    icon_thumb: icon_thumb
                        ? `${icon_thumb.md5}.${icon_thumb.mimetype
                            .split("/")[1]
                            .substr(0, 3)}`
                        : c.icon_thumb,
                    slug: slugify(uz_name.toLowerCase()),
                },
                {
                    where: {
                        category_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            category = await category[1][0];

            res.status(200).json({
                ok: true,
                message: "published",
                result: {
                    category,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BrandPostController(req, res) {
        try {
            const { brand_name, brand_site, category_id } = req.body;

            let brand = await req.db.brands.findOne({
                where: {
                    brand_name: brand_name,
                },
            });

            if (brand) {
                throw new Error("This brand has already added");
            }

            if (!brand_name && !category_id) {
                throw new Error("category_id and brand name is required");
            }

            const thumb = req?.files?.brand_thumb;

            if (!thumb) throw new Error("Thumb is not found");

            const mimetype = thumb.mimetype.split("/");

            if (mimetype[0] !== "image" && mimetype[0] !== "vector") {
                throw new Error("invalid file type for thumb");
            }

            const thumb_name = thumb.md5;
            const thumb_path = path.join(
                __dirname,
                "..",
                "..",
                "public",
                "images",
                "catalog-brands",
                `${thumb_name}.${mimetype[1]}`
            );

            await thumb.mv(thumb_path);

            brand = await req.db.brands.create({
                brand_name,
                brand_thumb: `${thumb_name}.${mimetype[1]}`,
                brand_site,
                category_id,
            });

            brand = await brand.dataValues;

            res.status(201).json({
                ok: true,
                message: "published",
                result: {
                    brand,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BrandDeleteController(req, res) {
        try {
            const { id } = req.body;
            await req.db.brands.destroy({
                where: {
                    brand_id: id,
                },
            });
            res.send({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.send(400).json({
                ok: false,
            });
        }
    }

    static async BrandsGetController(req, res) {
        try {
            let { p_page, c_page } = req.query;
            if (!(p_page || c_page)) {
                p_page = 10;
                c_page = 1;
            }
            if (Number(p_page) === NaN || Number(c_page) === NaN) {
                throw new Error("invalid c_page and p_page options");
            }

            const totalCount = await req.db.brands.count();
            const categories = await req.db.categories.findAll();

            const brands = await req.db.brands.findAll({
                raw: true,
                limit: p_page,
                offset: p_page * (c_page - 1),
                include: {
                    model: req.db.categories,
                },
            });

            res.render("admin/brands", {
                title: "Admin | Brands",
                brands,
                totalCount,
                categories,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BrandGetByIdController(req, res) {
        try {
            const id = req.params.id;
            const brand = await req.db.brands.findOne({
                where: {
                    brand_id: id,
                },
            });
            const categories = await req.db.categories.findAll();

            res.status(200).json({
                ok: true,
                result: {
                    brand,
                    categories,
                },
            });
        } catch (e) {
            res.status(404).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BrandUpdateController(req, res) {
        try {
            const { brand_name, brand_site, brand_id, category_id } = req.body;

            if (!brand_name || !brand_site || !brand_id || !category_id) {
                throw new Error("brand_id and brand name is required");
            }

            let brand = await req.db.brands.findOne({
                where: {
                    brand_id,
                },
            });

            if (!brand) {
                throw new Error("Unknown brand");
            }

            let thumb = req?.files?.brand_thumb,
                thumb_name,
                mimetype;

            if (thumb) {
                mimetype = thumb.mimetype.split("/");

                if (mimetype[0] !== "image" && mimetype[0] !== "vector") {
                    throw new Error("invalid file type for thumb");
                }

                thumb_name = thumb.md5;
                const thumb_path = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "catalog-brands",
                    `${thumb_name}.${mimetype[1]}`
                );

                await thumb.mv(thumb_path);
            }

            brand = await req.db.brands.update(
                {
                    brand_name,
                    brand_thumb: thumb ? `${thumb_name}.${mimetype[1]}` : brand.thumb,
                    brand_site,
                    category_id,
                },
                {
                    where: {
                        brand_id,
                    },
                }
            );

            res.status(201).json({
                ok: true,
                message: "published",
                result: {
                    brand,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsPatchController(req, res) {
        try {
            let {
                uz_name,
                en_name,
                ru_name,
                price,
                sale,
                uz_description,
                ru_description,
                en_description,
                category_id,
                product_brand_id,
                options,
                product_id,
                thumbs,
                sub_category_id,
                sub_sub_category_id,
            } = await productPatchValidation.validateAsync(req.body);

            thumbs = JSON.parse(thumbs);

            let product = await req.db.products.findOne({
                where: {
                    slug: slugify(uz_name.toLowerCase()),
                },
            });

            let p = await req.db.products.findOne({
                where: {
                    product_id,
                },
                raw: true,
            });

            if (p.slug !== product?.slug) {
                if (product) {
                    throw new Error("Change product name");
                }
            }

            if (req?.files?.length < 1) {
                throw new Error("Product thumb is required");
            }
            let arr = p.thumb;

            for (let thumb of thumbs) {
                let index = arr.findIndex((el) => el === thumb);

                if (index === - 1)
                    throw new Error(`Product thumb (${thumb}) is not found`);

                arr.splice(index, 1);
            }

            for (let i in req.files) {
                let thumb = req.files[i];
                if (
                    thumb.mimetype.split("/")[0] !== "image" &&
                    thumb.mimetype.split("/")[0] !== "vector"
                ) {
                    throw new Error("Thumb must be image");
                }
                let type = thumb.mimetype.split("/")[1];
                const thumb_path = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "products",
                    `${thumb.md5}.${type}`
                );

                await thumb.mv(thumb_path, (err) => {
                });

                arr.push(`${thumb.md5}.${type}`);
            }

            product = await req.db.products.update(
                {
                    slug: slugify(uz_name.toLowerCase()),
                    uz_name,
                    ru_name,
                    en_name,
                    price,
                    sale,
                    uz_description,
                    ru_description,
                    en_description,
                    thumb: arr,
                    category_id,
                    product_brand_id,
                    options,
                    sub_category_id: sub_category_id ? sub_category_id : null,
                    sub_sub_category_id: sub_sub_category_id ? sub_sub_category_id : null,
                },
                {
                    where: {
                        product_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            if (product[0] === 1) {
                product = product[1][0];
            } else {
                product = null;
            }

            res.status(201).json({
                ok: true,
                product,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductPostController(req, res) {
        try {
            const {
                uz_name,
                en_name,
                ru_name,
                price,
                sale,
                uz_description,
                ru_description,
                en_description,
                sub_sub_category_id,
                product_brand_id,
                options,
                category_id,
                sub_category_id,
            } = await productPostValidation.validateAsync(req.body);

            let product = await req.db.products.findOne({
                where: {
                    slug: slugify(uz_name.toLowerCase()),
                },
            });

            if (product) {
                throw new Error("Product slug must be unique");
            }

            if (req?.files?.length < 1) {
                throw new Error("Product thumb is required");
            }
            let arr = [];
            for (let i in req.files) {
                let thumb = req.files[i];
                if (
                    thumb.mimetype.split("/")[0] !== "image" &&
                    thumb.mimetype.split("/")[0] !== "vector"
                ) {
                    throw new Error("Thumb must be image");
                }
                let type = thumb.mimetype.split("/")[1];
                const thumb_path = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "products",
                    `${thumb.md5}.${type}`
                );

                await thumb.mv(thumb_path, (err) => {
                });

                arr.push(`${thumb.md5}.${type}`);
            }

            product = await req.db.products.create({
                slug: slugify(uz_name.toLowerCase()),
                uz_name,
                ru_name,
                en_name,
                price,
                sale,
                uz_description,
                ru_description,
                en_description,
                thumb: arr,
                sub_sub_category_id,
                product_brand_id,
                options,
                category_id,
                sub_category_id,
            });

            product = await product.dataValues;

            res.status(201).json({
                ok: true,
                message: "published",
                product,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductUpdateRenderController(req, res) {
        try {
            const id = await req.params.id;

            const product = await req.db.products.findOne({
                where: {
                    product_id: id,
                },
            });

            const secondaryCategories = await req.db.sub_category.findAll();
            const tertiaryCategories = await req.db.sub_sub_category.findAll();
            const productBrands = await req.db.product_brands.findAll();

            console.log(product);

            res.render("admin/edit-product", {
                title: "Edit Product",
                product,
                categories: req.categories,
                secondaryCategories,
                tertiaryCategories,
                productBrands,
            });
        } catch (e) {
        }
    }

    static async ProductBrandPostController(req, res) {
        try {
            const { brand_name } = req.body;
            if (!brand_name) throw new Error("Invalid Brand name");

            let brand = await req.db.product_brands.create({
                brand_name,
            });

            brand = await brand.dataValues;

            res.status(201).json({
                ok: true,
                message: "published",
                result: {
                    brand,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductBrandsGetController(req, res) {
        try {
            let { p_page, c_page } = req.query;
            if (!(p_page || c_page)) {
                p_page = 20;
                c_page = 1;
            }
            if (Number(p_page) === NaN || Number(c_page) === NaN) {
                throw new Error("invalid c_page and p_page options");
            }

            const totalCount = await req.db.product_brands.count();

            const productBrands = await req.db.product_brands.findAll({
                raw: true,
                limit: p_page,
                offset: p_page * (c_page - 1),
            });

            res.render("admin/product-brands", {
                title: "Admin | Products brands",
                productBrands,
                totalCount,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductBrandDeleteController(req, res) {
        try {
            const { product_brand_id } = req.body;
            await req.db.product_brands.destroy({
                where: {
                    product_brand_id,
                },
            });
            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: "bad request",
            });
        }
    }

    static async ProductBrandUpdateController(req, res) {
        try {
            const { product_brand_name, product_brand_id } = req.body;
            await req.db.product_brands.update(
                {
                    brand_name: product_brand_name,
                },
                {
                    where: {
                        product_brand_id: product_brand_id,
                    },
                }
            );
            res.status(200).json({
                ok: true,
                message: "updated",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: "bad request",
            });
        }
    }

    static async ProductBrandGetByIdController(req, res) {
        try {
            const productBrand = await req.db.product_brands.findOne({
                where: {
                    product_brand_id: req.params.id,
                },
            });
            res.status(200).json({
                ok: true,
                productBrand,
            });
        } catch (e) {
            res.status(404).json({
                ok: false,
                message: "not found",
            });
        }
    }

    static async ProductColorsPostController(req, res) {
        try {
            const { product_color_name, product_id } =
                await productColorsPostValidation.validateAsync(req.body);
            if (!req.files) throw new Error("Thumb is required");
            let thumb = req.files?.thumb;
            if (!thumb) throw new Error("Thumb is required");
            let type = thumb.mimetype.split("/");

            if (type[0] !== "image" && type[0] !== "vector") {
                throw new Error("thumb type must be an image");
            }

            let thumb_path = path.join(
                __dirname,
                "public",
                "images",
                "products",
                `${thumb.md5}.${type[1]}`
            );

            await thumb.mv(thumb_path, (err) => {
            });

            let product_color = await req.db.product_colors.create({
                product_color_name,
                thumb: `${thumb.md5}.${type[1]}`,
                product_id,
            });

            product_color = await product_color.dataValues;

            res.status(201).json({
                ok: true,
                result: {
                    product_color,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductModelPostController(req, res) {
        try {
            const { name, difference, difference_price, product_id } =
                await productModelPostValidation.validateAsync(req.body);

            let product_model = await req.db.models.create({
                product_id,
                name,
                difference,
                difference_price,
            });

            res.status(201).json({
                ok: true,
                message: "created",
                result: {
                    model: product_model,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsGetController(req, res) {
        try {
            let { p_page, c_page, category_slug } = req.query;
            let products;
            if (!(p_page || c_page)) {
                p_page = 10;
                c_page = 1;
            }
            if (Number(p_page) === NaN || Number(c_page) === NaN) {
                throw new Error("invalid c_page and p_page options");
            }

            let totalCount;

            if (category_slug === "all") {
                products = await req.db.products.findAll({
                    raw: true,
                    limit: p_page,
                    offset: p_page * (c_page - 1),
                    include: [
                        {
                            model: req.db.categories,
                        },

                        {
                            model: req.db.product_brands,
                        },
                    ],
                });

                totalCount = await req.db.products.count();
            } else {
                let category = await req.db.categories.findOne({
                    where: {
                        slug: category_slug.toLowerCase(),
                    },
                    raw: true,
                });

                if (!category) {
                    throw new Error("Invalid category");
                }

                products = await req.db.products.findAll({
                    where: {
                        category_id: category.category_id,
                    },
                    raw: true,
                    limit: p_page,
                    offset: p_page * (c_page - 1),
                    include: [
                        {
                            model: req.db.categories,
                        },
                        {
                            model: req.db.product_brands,
                        },
                    ],
                });

                totalCount = await req.db.products.count();
            }

            for (let product of products) {
                let model = await req.db.models.findAll({
                    where: {
                        product_id: product.product_id,
                    },
                    raw: true,
                });
                let colors = await req.db.product_colors.findAll({
                    where: {
                        product_id: product.product_id,
                    },
                    raw: true,
                });
                product.models = model;
                product.colors = colors;
            }

            const secondaryCategories = await req.db.sub_category.findAll(),
                tertiaryCategories = await req.db.sub_sub_category.findAll();
            let recommendations = await req.db.recomendations.findAll({
                attributes: ["product_id"],
            });

            recommendations = recommendations.map((r) => r.product_id);

            let bestsellers = await req.db.bestsellers.findAll({
                attributes: ["product_id"],
            });

            bestsellers = bestsellers.map((b) => b.product_id);

            res.render("admin/products", {
                title: "Admin | Products",
                products,
                totalCount,
                secondaryCategories,
                tertiaryCategories,
                recommendations,
                bestsellers,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductAddGetController(req, res) {
        try {
            const categories = await req.db.categories.findAll(),
                productBrands = await req.db.product_brands.findAll();

            res.render("admin/add-product", {
                categories,
                productBrands,
                title: "Admin | Add product",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: "bad request",
            });
        }
    }

    static async ProductModelPatchValidation(req, res) {
        try {
            const { name, difference, difference_price, model_id } =
                await productModelPatchValidation.validateAsync(req.body);

            const model = await req.db.models.update(
                {
                    name,
                    difference,
                    difference_price,
                },
                {
                    where: {
                        model_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            res.status(200).json({
                ok: true,
                model: model[1][0],
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductColorsPatchController(req, res) {
        try {
            const { product_color_name, product_color_id } =
                await productColorPatchValidation.validateAsync(req.body);

            if (!req.files) throw new Error("Thumb is required");

            let thumb = req.files?.thumb;
            if (!thumb) throw new Error("Thumb is required");
            let type = thumb.mimetype.split("/");

            if (type[0] !== "image" && type[0] !== "vector") {
                throw new Error("thumb type must be an image");
            }

            let thumb_path = path.join(
                __dirname,
                "public",
                "images",
                "products",
                `${thumb.md5}.${type[1]}`
            );

            await thumb.mv(thumb_path, (err) => {
            });

            let product_color = await req.db.product_colors.update(
                {
                    product_color_name,
                    thumb: `${thumb.md5}.${type[1]}`,
                },
                {
                    where: {
                        product_color_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            product_color = product_color[1][0];

            res.status(201).json({
                ok: true,
                result: {
                    product_color,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsDeleteController(req, res) {
        try {
            const { id } = req.body;

            await req.db.products.destroy({
                where: {
                    product_id: id,
                },
            });

            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: "bad request",
            });
        }
    }

    static async UsersGetController(req, res) {
        try {
            let { c_page, p_page } = req.query;

            if (!(p_page || c_page)) {
                p_page = 20;
                c_page = 1;
            }

            if (Number(p_page) === NaN || Number(c_page) === NaN) {
                throw new Error("invalid c_page and p_page options");
            }

            let users;

            if (req.user.role === "admin") {
                users = await req.db.users.findAll({
                    raw: true,
                    limit: p_page,
                    offset: p_page * (c_page - 1),
                    where: {
                        role: {
                            [Op.and]: {
                                [Op.ne]: "admin",
                                [Op.ne]: "superadmin",
                            },
                        },
                    },
                });
            } else {
                users = await req.db.users.findAll({
                    raw: true,
                    limit: p_page,
                    offset: p_page * (c_page - 1),
                    where: {
                        role: {
                            [Op.ne]: "superadmin",
                        },
                    },
                });
            }

            const totalCount = await req.db.users.count();

            res.render("admin/customers", {
                title: "Admin | Users",
                users,
                totalCount,
                currentUserRole: req.user.role,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async makeAdmin(req, res) {
        try {
            const { user_id } = req.body;

            let user = await req.db.users.update(
                {
                    role: "admin",
                },
                {
                    where: { user_id },
                    raw: true,
                    returning: true,
                }
            );

            user = await user[1][0];

            res.status(200).json({
                ok: true,
                user: user,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async removeAdmin(req, res) {
        try {
            const { user_id } = req.body;

            let user = await req.db.users.update(
                {
                    role: "user",
                },
                {
                    where: { user_id },
                    raw: true,
                    returning: true,
                }
            );

            user = await user[1][0];

            res.status(200).json({
                ok: true,
                user: user,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async adminOrdersGetController(req, res) {
        const orders = await req.db.orders.findAll();

        res.render("admin/orders", {
            title: "Orders",
            path: "/orders",
            orders: orders,
        });
    }

    static async OrdersGetController(req, res) {
        try {
            let { c_page, p_page } = req.query;
            c_page = c_page || 1;
            p_page = p_page || 20;
            let orders = await req.db.orders.findAll({
                raw: true,
                limit: p_page,
                offset: p_page * (c_page - 1),
            });

            for (let order of orders) {
                let order_items = await req.db.order_details.findAll({
                    where: {
                        order_id: order.order_id,
                    },
                    include: {
                        model: req.db.products,
                    },
                    raw: true,
                });
                order.items = order_items;
            }

            res.status(200).json({
                ok: true,
                result: {
                    orders,
                },
            });
        } catch (e) {
            res.status(403).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async OrdersPaymentPatchController(req, res) {
        try {
            const { order_id, is_payed } = req.body;

            let order = await req.db.orders.update(
                {
                    is_payed: is_payed,
                },
                {
                    where: {
                        order_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            if (order[1]) {
                order = await order[1][0];
            }

            res.status(200).json({
                ok: true,
                order: order,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async OrdersDeliveryPatchController(req, res) {
        try {
            const { order_id, is_shipped } = req.body;

            let order = await req.db.orders.update(
                {
                    is_shipped: is_shipped,
                },
                {
                    where: {
                        order_id,
                    },
                    raw: true,
                    returning: true,
                }
            );

            if (order[1]) {
                order = await order[1][0];
            }

            res.status(200).json({
                ok: true,
                order: order,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SponsorsAddController(req, res) {
        try {
            const { brand_name } = req.body;

            const logo = req.files?.logo;

            if (!logo) throw new Error("logo is required");

            const type = logo.mimetype.split("/")[0];
            const format = logo.mimetype.split("/")[1];

            if (type !== "image" && type !== "vector") {
                throw new Error("Logo type must be an image or svg vector");
            }

            const logo_path = path.join(
                __dirname,
                "..",
                "public",
                "images",
                "logos",
                `${logo.md5}.${format}`
            );

            await logo.mv(logo_path, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });

            let sponsor = await req.db.sponsors.create({
                brand_name: brand_name,
                brand_logo: `${logo.md5}.${format}`,
            });

            sponsor = await sponsor.dataValues;

            res.status(201).json({
                ok: true,
                message: "created",
                result: { sponsor },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SponsorsDeleteController(req, res) {
        try {
            const { sponsor_id } = req.body;

            let sponsor = await req.db.sponsors.findOne({
                where: {
                    sponsor_id,
                },
                raw: true,
            });

            if (!sponsor) throw new Error("Sponsor is not found");

            await req.db.destroy({
                where: {
                    sponsor_id,
                },
            });

            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SettingsPatchController(req, res) {
        try {
            let data = await settingsPatchValidation.validateAsync(req.body);

            let response = await fs.readFile(
                path.join(__dirname, "..", "settings.json"),
                { encoding: "utf-8" }
            );

            response = await JSON.parse(response);

            data = {
                ...response,
                ...data,
            };

            await fs.writeFile(
                path.join(__dirname, "..", "settings.json"),
                JSON.stringify(data),
                { encoding: "utf-8" }
            );

            res.status(200).json({
                ok: true,
                message: "updated",
                result: {
                    settings: data,
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BestSellerPostController(req, res) {
        try {
            const { product_id } = req.body;

            let bestseller = await req.db.bestsellers.findOne({
                where: {
                    product_id,
                },
                raw: true,
            });

            if (bestseller) throw new Error("Already added");

            bestseller = await req.db.bestsellers.create({
                product_id,
            });

            bestseller = bestseller.dataValues;

            res.status(201).json({
                ok: true,
                bestseller,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async BestSellerDeleteController(req, res) {
        try {
            const { product_id } = req.body;

            let bestseller = await req.db.bestsellers.destroy({
                where: {
                    product_id,
                },
            });

            res.status(200).json({
                ok: true,
                bestseller,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async RecomendationsPostController(req, res) {
        try {
            const { product_id } = req.body;

            let recomendation = await req.db.recomendations.findOne({
                where: {
                    product_id,
                },
                raw: true,
            });

            if (recomendation) throw new Error("Already added");

            recomendation = await req.db.recomendations.create({
                product_id,
            });

            recomendation = recomendation.dataValues;

            res.status(201).json({
                ok: true,
                recomendation,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async RecommendationsRenderController(req, res) {
        let { c_page, p_page } = req.query;

        c_page = c_page || 1;
        p_page = p_page || 30;

        let totalCount = await req.db.recomendations.count();

        let recommendations = await req.db.recomendations.findAll({
            limit: p_page,
            offset: p_page * (c_page - 1),
            raw: true,
            include: {
                model: req.db.products,
            },
        });

        res.render("admin/rec-products", {
            title: "Recommend products",
            recommendations,
            totalCount,
        });
    }

    static async BestsellersRenderController(req, res) {
        let { c_page, p_page } = req.query;

        c_page = c_page || 1;
        p_page = p_page || 30;

        let totalCount = await req.db.bestsellers.count();

        let bestsellers = await req.db.bestsellers.findAll({
            limit: p_page,
            offset: p_page * (c_page - 1),
            raw: true,
            include: {
                model: req.db.products,
            },
        });

        res.render("admin/best-product", {
            title: "Bestseller products",
            bestsellers,
            totalCount,
        });
    }

    static async RecomendationsDeleteController(req, res) {
        try {
            const { product_id } = req.body;

            let recomendation = await req.db.recomendations.destroy({
                where: {
                    product_id,
                },
            });

            res.status(200).json({
                ok: true,
                recomendation,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryBannersPostController(req, res) {
        try {
            console.log(req.body)
            console.log(req.files)
            const { category_id } = req.body;
            req.files = req.files ? req.files : { }
            const {
                big_banner_1x,
                big_banner_2x,
                small_banner_1,
                small_banner_2,
                small_banner_3,
                side_banner_left,
                side_banner_right,
            } = req.files


            console.log(big_banner_2x, "dadasdas")
            const {
                big_banner_url,
                small_banner_1_url,
                small_banner_2_url,
                small_banner_3_url,
                side_banner_left_url,
                side_banner_right_url,
            } = req.body;

            let category = await req.db.categories.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });

            if (!category) throw new Error("Category is not found");

            let banner = await req.db.banners.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });

            try {
                await fs.mkdir(
                    path.join(
                        __dirname,
                        "..",
                        "..",
                        "public",
                        "images",
                        "category_banners",
                        category_id
                    ),
                    {
                        recursive: true,
                    }
                );
            } catch (e) {
            } finally {
                for (let file in req.files) {
                    if (
                        req.files[file].mimetype.split("/")[0] !== "image" &&
                        req.files[file].mimetype.split("/")[0] !== "vector"
                    )
                        throw new Error("File is not image");
                    let fileName = file;
                    let fileType = req.files[file].mimetype.split("/")[1];
                    let filePath = path.join(
                        __dirname,
                        "..",
                        "..",
                        "public",
                        "images",
                        "category_banners",
                        category_id,
                        `${fileName}.${fileType}`
                    );

                    await req.files[file].mv(filePath);
                }
            }

            let category_banners

            if (!banner) {
                category_banners = await req.db.banners.create({
                    category_id,
                    big_banner_image_1x: big_banner_1x
                        ? `big_banner_1x.${big_banner_1x.mimetype.split("/")[1]}`
                        : null,
                    big_banner_image_2x: big_banner_2x
                        ? `big_banner_2x.${big_banner_2x.mimetype.split("/")[1]}`
                        : null,
                    small_banner_1_image: small_banner_1
                        ? `small_banner_1.${small_banner_1.mimetype.split("/")[1]}`
                        : null,
                    small_banner_2_image: small_banner_2
                        ? `small_banner_2.${small_banner_2.mimetype.split("/")[1]}`
                        : null,
                    small_banner_3_image: small_banner_3
                        ? `small_banner_3.${small_banner_3.mimetype.split("/")[1]}`
                        : null,
                    side_banner_left_image: side_banner_left
                        ? `side_banner_left.${side_banner_left.mimetype.split("/")[1]}`
                        : null,
                    side_banner_right_image: side_banner_right
                        ? `side_banner_right.${side_banner_right.mimetype.split("/")[1]}`
                        : null,
                    big_banner_url,
                    small_banner_1_url,
                    small_banner_2_url,
                    small_banner_3_url,
                    side_banner_left_url,
                    side_banner_right_url,
                });
                category_banners = await category_banners.dataValues;
            } else {
                category_banners = await req.db.banners.update(
                    {
                        category_id,
                        big_banner_image_1x: big_banner_1x
                            ? `big_banner_1x.${big_banner_1x.mimetype.split("/")[1]}`
                            : banner.big_banner_image_1x,
                        big_banner_image_2x: big_banner_2x
                            ? `big_banner_2x.${big_banner_2x.mimetype.split("/")[1]}`
                            : banner.big_banner_image_2x,
                        small_banner_1_image: small_banner_1
                            ? `small_banner_1.${small_banner_1.mimetype.split("/")[1]}`
                            : banner.small_banner_1_image,
                        small_banner_2_image: small_banner_2
                            ? `small_banner_2.${small_banner_2.mimetype.split("/")[1]}`
                            : banner.small_banner_2_image,
                        small_banner_3_image: small_banner_3
                            ? `small_banner_3.${small_banner_3.mimetype.split("/")[1]}`
                            : banner.small_banner_3_image,
                        side_banner_left_image: side_banner_left
                            ? `side_banner_left.${side_banner_left.mimetype.split("/")[1]}`
                            : banner.side_banner_left_image,
                        side_banner_right_image: side_banner_right
                            ? `side_banner_right.${side_banner_right.mimetype.split("/")[1]}`
                            : banner.side_banner_right_image,
                        big_banner_url: big_banner_url ? big_banner_url : banner.big_banner_url,
                        small_banner_1_url: small_banner_1_url ? small_banner_1_url : banner.small_banner_1_url,
                        small_banner_2_url: small_banner_2_url ? small_banner_2_url : banner.small_banner_2_url,
                        small_banner_3_url: small_banner_3_url ? small_banner_3_url : banner.small_banner_3_url,
                        side_banner_left_url: side_banner_left_url ? side_banner_left_url : banner.side_banner_left_url,
                        side_banner_right_url: side_banner_right_url ? side_banner_right_url : banner.side_banner_right_url,
                    },
                    {
                        where: {
                            category_id,
                        },
                        returning: true
                    }
                );
                category_banners = await category_banners[1][0];
            }

            res.status(201).json({
                ok: true,
                category_banners
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async HomeBannersRenderController(req, res) {
        res.render("admin/home-banners", {
            title: "Home banners",
            categories: req.categories,
        });
    }

    static async HomeBannersPostController(req, res) {
        console.log(req.files)
        console.log(req.body)
        try {
            let urls = Object.keys(req.body)

            let files = req.files;

            let file_names = Object.keys(req.files);

            let homeBanners = await fs.readFile(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "banners.json"
                )
            );
            homeBanners = await JSON.parse(homeBanners);

            let carousel_files = homeBanners.carousel

            for (let file in files) {
                let fileType = files[file].mimetype.split("/");
                let filePath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "banner",
                    `${files[file].md5}.${fileType[1]}`
                );
                await files[file].mv(filePath)

                if (file.includes("carousel")) {
                    carousel_files.push({
                        url: req.body[urls[file_names.indexOf(`${file}`)]],
                        img: `${files[file].md5}.${fileType[1]}`
                    });
                } else {
                    homeBanners[file] = {
                        url: req.body[urls[file_names.indexOf(file)]],
                        img: `${files[file].md5}.${fileType[1]}`
                    };
                }
            }

            homeBanners.carousel = carousel_files;

            await fs.writeFile(
                path.join(__dirname, "..", "..", "banners.json"),
                JSON.stringify(homeBanners),
                { encoding: "utf-8" }
            );

            res.status(200).json({
                ok: true,
                banners: homeBanners,
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async HomeBannersResetController(req, res) {
        try {
            await fs.writeFile(
                path.join(__dirname, "..", "..", "banners.json"),
                JSON.stringify({
                    carousel: [],
                    small_banner_1: {
                        img: "",
                        url: "",
                    },
                    small_banner_2: {
                        img: "",
                        url: "",
                    },
                    bottom_banner_1: {
                        img: "",
                        url: "",
                    },
                    bottom_banner_2: {
                        img: "",
                        url: "",
                    },
                    side_banner_left: {
                        img: "",
                        url: "",
                    },
                    side_banner_right: {
                        img: "",
                        url: "",
                    },
                }),
                { encoding: "utf-8" }
            );

            res.status(200).json({
                ok: true,
                message: "Reseted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryBannersGetController(req, res) {
        try {
            const { category_id } = req.params
            const category = await req.db.categories.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });
            if (!category) throw new Error("Category is not found");
            let category_banners = await req.db.banners.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });

            res.status(200).json({
                ok: true,
                banners: category_banners,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryBannerAddRenderController(req, res) {
        res.render("admin/add-banners", {
            title: "Admin | Add banner",
            categories: req.categories,
        });
    }

    static async CategoryBannersDeleteAllController(req, res) {
        try {
            const { category_id } = req.params;
            const category = await req.db.categories.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });
            if (!category) throw new Error("Category is not found");
            let category_banners = await req.db.banners.findAll({
                where: {
                    category_id,
                },
                raw: true,
            });

            for (let file in category_banners) {
                let filePath = path.join(
                    __dirname,
                    "..",
                    "public",
                    "images",
                    "category_banners",
                    category_id,
                    `${file.file_name}.${file.file_type}`
                );
                await fs.unlink(filePath);
            }

            await req.db.banners.destroy({
                where: {
                    category_id,
                },
            });

            res.status(200).json({
                ok: true,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoriesGetController(req, res) {
        try {
            const { category_id } = req.params;
            const sub_categories = await req.db.sub_category.findAll({
                where: {
                    category_id,
                },
                raw: true,
            });
            res.status(200).json({
                ok: true,
                sub_categories,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoryGetByIdController(req, res) {
        try {
            const { id } = req.params;
            const sub_category = await req.db.sub_category.findOne({
                where: {
                    sub_category_id: id,
                },
                raw: true,
                include: {
                    model: req.db.categories,
                },
            });
            res.status(200).json({
                ok: true,
                sub_category,
                categories: req.categories,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    } // 3

    static async SubSubCategoriesGetController(req, res) {
        try {
            const { sub_category_id } = req.params;
            const sub_sub_categories = await req.db.sub_sub_category.findAll({
                where: {
                    sub_category_id,
                },
                raw: true,
            });
            res.status(200).json({
                ok: true,
                sub_sub_categories,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubSubCategoriesGetByIdController(req, res) {
        try {
            const { id } = req.params;
            const sub_sub_category = await req.db.sub_sub_category.findOne({
                where: {
                    sub_sub_category_id: id,
                },
                raw: true,
            });

            const sub_category = await req.db.sub_category.findOne({
                where: {
                    sub_category_id: sub_sub_category.sub_category_id,
                },
            });
            res.status(200).json({
                ok: true,
                categories: req.categories,
                sub_category,
                sub_sub_category,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoryPostController(req, res) {
        try {
            const {
                category_id,
                sub_category_name_uz,
                sub_category_name_en,
                sub_category_name_ru,
            } = await sub_categoryPostValidation.validateAsync(req.body);
            const { sub_category_image } = req.files;

            const category = await req.db.categories.findOne({
                where: {
                    category_id,
                },
                raw: true,
            });

            if (!category) throw new Error("Category is not found");

            let fileName = sub_category_image.md5;
            let fileType = sub_category_image.mimetype.split("/")[1];
            if (
                sub_category_image.mimetype.split("/")[0] !== "image" &&
                sub_category_image.mimetype.split("/")[0] !== "vector"
            )
                throw new Error("category image must be image or vector");

            let filePath = path.join(
                __dirname,
                "..",
                "..",
                "public",
                "images",
                "sub_categories",
                `${fileName}.${fileType}`
            );

            await sub_category_image.mv(filePath);

            let sub_category = await req.db.sub_category.create({
                category_id,
                sub_category_name_uz,
                sub_category_name_en,
                sub_category_name_ru,
                sub_category_image: `${fileName}.${fileType}`,
                sub_category_slug: slugify(sub_category_name_uz.toLowerCase()),
            });

            res.status(201).json({
                ok: true,
                sub_category,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubSubCategoryPostController(req, res) {
        try {
            const {
                sub_category_id,
                sub_sub_category_name_uz,
                sub_sub_category_name_en,
                sub_sub_category_name_ru,
                category_id,
            } = await sub_sub_categoryPostValidation.validateAsync(req.body);

            const { sub_sub_category_image } = req.files;

            if (!sub_sub_category_image)
                throw new Error("Sub Sub Category_image is required");

            const sub_category = await req.db.sub_category.findOne({
                where: {
                    sub_category_id,
                },
                raw: true,
            });

            if (!sub_category) throw new Error("Sub Category is not found");

            let fileName = sub_sub_category_image.md5;
            let fileType = sub_sub_category_image.mimetype.split("/")[1];
            if (
                sub_sub_category_image.mimetype.split("/")[0] !== "image" &&
                sub_sub_category_image.mimetype.split("/")[0] !== "vector"
            )
                throw new Error("sub sub category image mustbe image or vector");

            let filePath = path.join(
                __dirname,
                "..",
                "..",
                "public",
                "images",
                "sub_sub_categories",
                `${fileName}.${fileType}`
            );

            await sub_sub_category_image.mv(filePath);

            let sub_sub_category = await req.db.sub_sub_category.create({
                sub_category_id,
                sub_sub_category_name_uz,
                sub_sub_category_name_en,
                sub_sub_category_name_ru,
                sub_sub_category_image: `${fileName}.${fileType}`,
                sub_sub_category_slug: slugify(sub_sub_category_name_uz.toLowerCase()),
                category_id,
            });

            res.status(201).json({
                ok: true,
                sub_sub_category,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoryPatchController(req, res) {
        try {
            const {
                category_id,
                sub_category_name_uz,
                sub_category_name_ru,
                sub_category_name_en,
                sub_category_id,
            } = await sub_categoryPatchValidation.validateAsync(req.body);

            const sub_category = await req.db.sub_category.findOne({
                where: {
                    sub_category_id,
                },
                raw: true,
            });

            if (!sub_category) throw new Error("Sub Category is not found");

            let s = await req.db.sub_category.findOne({
                where: {
                    sub_category_slug: slugify(sub_category_name_uz.toLowerCase()),
                },
                raw: true,
            });

            if (s) {
                if (s.sub_category_id !== sub_category.sub_category_id) {
                    throw new Error("Sub category slug must be unique");
                }
            }

            let sub_category_update;

            if (req.files) {
                const { sub_category_image } = req.files;
                let fileName = sub_category_image.md5;
                let fileType = sub_category_image.mimetype.split("/")[1];
                if (
                    sub_category_image.mimetype.split("/")[0] !== "image" &&
                    sub_category_image.mimetype.split("/")[0] !== "vector"
                )
                    throw new Error("sub category image mustbe image or vector");

                let filePath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "sub_categories",
                    `${fileName}.${fileType}`
                );

                await sub_category_image.mv(filePath);

                sub_category_update = await req.db.sub_category.update(
                    {
                        sub_category_name_uz,
                        sub_category_name_ru,
                        sub_category_name_en,
                        sub_category_slug: slugify(sub_category_name_uz),
                        sub_category_image: `${fileName}.${fileType}`,
                        category_id,
                    },
                    {
                        where: {
                            sub_category_id,
                        },
                    }
                );
            } else {
                sub_category_update = await req.db.sub_category.update(
                    {
                        sub_category_name_uz,
                        sub_category_name_ru,
                        sub_category_name_en,
                        sub_category_slug: slugify(sub_category_name_uz),
                        category_id,
                    },
                    {
                        where: {
                            sub_category_id,
                        },
                    }
                );
            }

            res.status(200).json({
                ok: true,
                sub_category_update,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoriesRenderController(req, res) {
        let { c_page, p_page } = req.query;

        c_page = c_page || 1;
        p_page = p_page || 20;

        let totalCount = await req.db.sub_category.count();

        let sub_categories = await req.db.sub_category.findAll({
            limit: p_page,
            offset: p_page * (c_page - 1),
            raw: true,
            include: {
                model: req.db.categories,
            },
        });

        res.render("admin/secondary-categories", {
            title: "Secondary categories",
            sub_categories,
            totalCount,
            categories: req.categories,
        });
    }

    static async SubSubCategoriesRenderController(req, res) {
        let { c_page, p_page } = req.query;

        c_page = c_page || 1;
        p_page = p_page || 20;

        let sub_sub_categories = await req.db.sub_sub_category.findAll({
            limit: p_page,
            offset: p_page * (c_page - 1),
            raw: true,
            include: {
                model: req.db.sub_category,
            },
        });

        let sub_categories = await req.db.sub_category.findAll();

        let totalCount = await req.db.sub_sub_category.count();

        res.render("admin/tertiary-categories", {
            title: "Admin | Tertiary categories",
            sub_sub_categories,
            categories: req.categories,
            sub_categories,
            totalCount,
        });
    }

    static async SubSubCategoryPatchController(req, res) {
        try {
            const {
                sub_category_id,
                sub_sub_category_name_uz,
                sub_sub_category_name_ru,
                sub_sub_category_name_en,
                sub_sub_category_id,
                category_id,
            } = await sub_sub_categoryPatchValidation.validateAsync(req.body);

            const sub_sub_category = await req.db.sub_sub_category.findOne({
                where: {
                    sub_sub_category_id,
                },
                raw: true,
            });

            if (!sub_sub_category) {
                throw new Error("Tertiary category is not found");
            }

            let s = await req.db.sub_sub_category.findOne({
                where: {
                    sub_sub_category_slug: slugify(
                        sub_sub_category_name_uz.toLowerCase()
                    ),
                },
                raw: true,
            });

            if (s) {
                if (s.sub_sub_category_id !== sub_sub_category.sub_sub_category_id) {
                    throw new Error("Tertiary category name must be unique");
                }
            }

            if (req.files) {
                const { sub_sub_category_image } = req.files;
                let fileName = sub_sub_category_image.md5;
                let fileType = sub_sub_category_image.mimetype.split("/")[1];
                if (
                    sub_sub_category_image.mimetype.split("/")[0] !== "image" &&
                    sub_sub_category_image.mimetype.split("/")[0] !== "vector"
                ) {
                    throw new Error("Tertiary category image must be image or vector");
                }

                let filePath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    "sub_sub_categories",
                    `${fileName}.${fileType}`
                );

                await sub_sub_category_image.mv(filePath);

                await req.db.sub_sub_category.update(
                    {
                        sub_sub_category_name_uz,
                        sub_sub_category_name_ru,
                        sub_sub_category_name_en,
                        sub_sub_category_slug: slugify(sub_sub_category_name_uz),
                        sub_sub_category_image: `${fileName}.${fileType}`,
                        sub_category_id,
                        category_id,
                    },
                    {
                        where: {
                            sub_sub_category_id,
                        },
                    }
                );
            } else {
                await req.db.sub_sub_category.update(
                    {
                        sub_sub_category_name_uz,
                        sub_sub_category_name_ru,
                        sub_sub_category_name_en,
                        sub_sub_category_slug: slugify(sub_sub_category_name_uz),
                        sub_category_id,
                        category_id,
                    },
                    {
                        where: {
                            sub_sub_category_id,
                        },
                    }
                );
            }
            res.status(200).json({
                ok: true,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubCategoryDeleteController(req, res) {
        try {
            const { sub_category_id } = req.body;
            await req.db.sub_category.destroy({
                where: {
                    sub_category_id: sub_category_id,
                },
            });

            await req.db.sub_sub_category.destroy({
                where: {
                    sub_category_id,
                },
            });

            await req.db.products.destroy({
                where: {
                    sub_category_id,
                },
            });

            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async SubSubCategoryDeleteController(req, res) {
        try {
            const { sub_sub_category_id } = req.body;
            await req.db.sub_sub_category.destroy({
                where: {
                    sub_sub_category_id: sub_sub_category_id,
                },
            });
            await req.db.products.destroy({
                where: {
                    sub_sub_category_id,
                },
            });

            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }
};
