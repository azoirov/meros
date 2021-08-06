const {
    ProductsGetController,
    ProductsFilterGetController,
    ProductsSearchGetController,
    CategoryGetController,
    SubCategoryGetController,
    cartIncre
} = require("../controllers/product/product-controller");
const { SubSubCategory } = require("../models/models");

const router = require("express").Router();

router.get("/product/search", ProductsSearchGetController);
router.get("/:category_slug", CategoryGetController);
router.get("/:category_slug/:sub_category_slug", SubCategoryGetController);
router.get(
    "/:category_slug/:sub_category_slug/:sub_sub_category_slug",
    ProductsGetController
);
router.get("/filter/:category_slug", ProductsFilterGetController)

module.exports = {
    path: "/category",
    router
};
