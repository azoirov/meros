const {
    adminGetController,

    adminOrdersGetController,
    OrdersGetController,
    OrdersPaymentPatchController,
    OrdersDeliveryPatchController,

    adminBrandsGetController,
    BrandDeleteController,
    BrandsGetController,
    BrandGetByIdController,
    BrandPostController,
    BrandUpdateController,

    CategoryGetById,
    CategoriesPostController,
    CategoriesDeleteController,
    adminCategoriesGetController,
    CategoriesGetController,
    CategoryPatchController,

    ProductPostController,
    ProductBrandPostController,
    ProductBrandsGetController,
    ProductBrandDeleteController,
    ProductBrandUpdateController,
    ProductBrandGetByIdController,
    ProductColorsPostController,
    ProductModelPostController,
    ProductsGetController,
    ProductsPatchController,
    ProductModelPatchValidation,
    ProductColorsPatchController,
    adminProductsGetController,
    ProductAddGetController,
    ProductsDeleteController,
    ProductUpdateRenderController,

    UsersGetController,
    adminCustomersGetController,

    makeAdmin,
    removeAdmin,

    BannersPostController,
    BannersDeleteController,

    SponsorsAddController,
    SettingsPatchController,

    SubCategoriesRenderController,
    SubCategoryPostController,
    SubCategoryDeleteController,
    SubCategoryGetByIdController,
    SubCategoryPatchController,
    SubCategoriesGetController,

    SubSubCategoriesRenderController,
    SubSubCategoriesGetController,
    SubSubCategoryPostController,
    SubSubCategoryDeleteController,
    SubSubCategoriesGetByIdController,
    SubSubCategoryPatchController,

    CategoryBannersPostController,
    CategoryBannersGetController,
    CategoryBannersDeleteAllController,
    CategoryBannerAddRenderController,
    HomeBannersPostController,
    HomeBannersRenderController,

    RecomendationsPostController,
    RecomendationsDeleteController,
    RecommendationsRenderController,
    BestSellerPostController,
    BestSellerDeleteController,
    BestsellersRenderController,

} = require("../controllers/admin/admin-controller");

const AdminMiddleware = require("../middlewares/admin-middleware");
const FileUpload = require("express-fileupload");

const router = require("express").Router();

router.use(AdminMiddleware);

router.get("/", adminGetController);

router.get("/orders", adminOrdersGetController);
router.get("/api/orders", OrdersGetController);
router.patch("/api/orders-payment", OrdersPaymentPatchController);
router.patch("/api/orders-delivery", OrdersDeliveryPatchController);

router.post("/api/category", FileUpload(), CategoriesPostController);
router.get("/categories", CategoriesGetController);
router.get("/api/categories-id/:id", CategoryGetById);
router.patch("/api/update/category", FileUpload(), CategoryPatchController);
router.post("/api/delete/category", CategoriesDeleteController);

router.get('/secondary-categories', SubCategoriesRenderController)
router.get('/secondary-categories/:id', SubCategoryGetByIdController)
router.post('/secondary-categories', FileUpload(), SubCategoryPostController)
router.post('/secondary-categories/delete', SubCategoryDeleteController)
router.post('/secondary-categories/update', FileUpload(), SubCategoryPatchController)

router.get('/tertiary-categories', SubSubCategoriesRenderController)
router.get('/tertiary-categories/:id', SubSubCategoriesGetByIdController)
router.post('/tertiary-categories', FileUpload(), SubSubCategoryPostController)
router.post('/tertiary-categories/delete', SubSubCategoryDeleteController)
router.post('/tertiary-categories/update', FileUpload(), SubSubCategoryPatchController)

router.post('/category-banner', FileUpload(), CategoryBannersPostController)

router.post("/api/brand", FileUpload(), BrandPostController);
router.post("/api/delete/brand", BrandDeleteController);
router.post("/api/update/brand", FileUpload(), BrandUpdateController);
router.get("/brands", BrandsGetController);
router.get("/api/brands/:id", BrandGetByIdController);

router.post("/api/product", FileUpload(), ProductPostController);
router.get("/product", ProductsGetController);
router.get('/product/edit/:id', ProductUpdateRenderController)
router.post('/product/edit', FileUpload(), ProductsPatchController)
router.post("/api/product-brands", ProductBrandPostController);
router.post("/api/product-brands/delete", ProductBrandDeleteController);
router.post("/api/product-brands/update", ProductBrandUpdateController);
router.get("/product-brands", ProductBrandsGetController);
router.get("/product-brands/:id", ProductBrandGetByIdController);
router.post("/api/product-color", FileUpload(), ProductColorsPostController);
router.post("/api/product-model", FileUpload(), ProductModelPostController);
router.get("/products", ProductsGetController);
router.post("/products/recommendations-add", RecomendationsPostController);
router.post("/products/recommendations-remove", RecomendationsDeleteController);
router.post("/products/bestseller-add", BestSellerPostController);
router.get("/products/bestsellers", BestsellersRenderController);
router.get("/products/recommendations", RecommendationsRenderController);
router.post("/products/bestseller-remove", BestSellerDeleteController);
router.get("/add-product", ProductAddGetController);
router.patch("/api/update/product", FileUpload(), ProductsPatchController);
router.post("/api/delete/product", ProductsDeleteController);

router.post("/api/sponsors", FileUpload(), SponsorsAddController);

router.get('/add-banners', CategoryBannerAddRenderController)
router.get('/home-banners', HomeBannersRenderController)
router.post('/home-banners', FileUpload(), HomeBannersPostController)

router.post("/api/users/make-admin", makeAdmin);
router.post("/api/users/remove-admin", removeAdmin);
router.get("/customers", UsersGetController);

router.get("category-banners", async(req, res) => {
    let categories = await req.db.categories.findAll({
        raw: true
    })
    res.render("category-banners-home", {
        categories
    })
});

router.get("/category-banners/:category_id", CategoryBannersGetController);

// router.delete("/api/banners", BannersDeleteController);

router.patch("/api/settings", SettingsPatchController);

router.patch(
    "/update/product-color",
    FileUpload(),
    ProductColorsPatchController
);
router.patch(
    "/update/product-model",
    FileUpload(),
    ProductModelPatchValidation
);
router.get("/api/secondary-category-list/:category_id", SubCategoriesGetController);
router.get("/api/tertiary-category-list/:sub_category_id", SubSubCategoriesGetController);
module.exports = {
    path: "/admin",
    router,
};
