const {
    WishListAddController,
    WishlistDeleteController,
    WishListGetController,
} = require("../controllers/product/product-controller");

const router = require("express").Router();

router.post("/", WishListAddController);
router.delete("/", WishlistDeleteController);
router.get("/", WishListGetController);

module.exports = {
    path: "/wishlist",
    router,
};
